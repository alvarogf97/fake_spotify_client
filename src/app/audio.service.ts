import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { RestService } from './rest.service';
import { Song } from './index/index.component'

@Injectable({
  providedIn: 'root'
})
export class AudioService {

    public audio: HTMLAudioElement;
    public timeElapsed: BehaviorSubject<string> = new BehaviorSubject('00:00');
    public timeRemaining: BehaviorSubject<string> = new BehaviorSubject('-00:00');
    public percentElapsed: BehaviorSubject<number> = new BehaviorSubject(0);
    public percentLoaded: BehaviorSubject<number> = new BehaviorSubject(0);
    public playerStatus: BehaviorSubject<string> = new BehaviorSubject('paused');
    public playlist: Song[]
    public actual_song: Song
    public actual_img: string
    public number_song: number

    constructor(private restService: RestService) {
        this.audio = new Audio();
        this.attachListeners();
        this.number_song = -1
    }

    private attachListeners(): void {
        this.audio.addEventListener('timeupdate', this.calculateTime, false);
        this.audio.addEventListener('playing', this.setPlayerStatus, false);
        this.audio.addEventListener('pause', this.setPlayerStatus, false);
        this.audio.addEventListener('progress', this.calculatePercentLoaded, false);
        this.audio.addEventListener('waiting', this.setPlayerStatus, false);
        this.audio.addEventListener('ended', this.setPlayerStatus, false);
    }

    private calculateTime = (evt) => {
        let ct = this.audio.currentTime;
        let d = this.audio.duration;
        this.setTimeElapsed(ct);
        this.setPercentElapsed(d, ct);
        this.setTimeRemaining(d, ct);
    }

    private calculatePercentLoaded = (evt) => {
        if (this.audio.duration > 0) {
            for (var i = 0; i < this.audio.buffered.length; i++) {
                if (this.audio.buffered.start(this.audio.buffered.length - 1 - i) < this.audio.currentTime) {
                    let percent = (this.audio.buffered.end(this.audio.buffered.length - 1 - i) / this.audio.duration) * 100;
                    this.setPercentLoaded(percent)
                    break;
                }
            }
        }
    }

    private setPlayerStatus = (evt) => {
        switch (evt.type) {
            case 'playing':
                this.playerStatus.next('playing');
                break;
            case 'pause':
                this.playerStatus.next('paused');
                break;
            case 'waiting':
                this.playerStatus.next('loading');
                break;
            case 'ended':
                this.playerStatus.next('ended');
                if(this.playlist){
                  this.next()
                }
                break;
            default:
                this.playerStatus.next('paused');
                break;
        }
    }

    /**
     * If you need the audio instance in your component for some reason, use this.
     */
    public getAudio(): HTMLAudioElement {
        return this.audio;
    }

    public setPlaylist(songs: Song[]): void {
        this.playlist = songs
        this.next()
        this.get_group_img();
        this.number_song = -1
    }

    public isPlayList() : Boolean {
        return this.playlist != null
    }

    /**
     * This is typically a URL to an MP3 file
     * @param src
     */
    public setAudio(song: Song): void {
        this.audio.src = this.restService.endpoint + song.url
        this.actual_song = song
        this.playAudio();
        this.get_group_img();
        this.playlist = null
    }

    /**
     * The method to play audio
     */
    public playAudio(): void {
        this.audio.play();
    }

    /**
     * The method to pause audio
     */
    public pauseAudio(): void {
        this.audio.pause();
    }

    public next(): void{
        this.number_song = this.number_song + 1
        if(this.number_song >= this.playlist.length){
          this.number_song = 0
        }
        var song = this.playlist[this.number_song]
        this.actual_song = song
        this.audio.src = this.restService.endpoint + song.url
        this.playAudio()
    }

    public prev(): void{
        this.number_song = this.number_song - 1
        if(this.number_song < 0){
          this.number_song = this.playlist.length - 1
        }
        var song = this.playlist[this.number_song]
        this.audio.src = this.restService.endpoint + 'group/' + song.album.group.name + '/' + song.album.name + '/' + song.name
        this.playAudio()
    }

    public isPlayingAudio(): boolean {
        return this.playerStatus.value == 'playing'
    }

    /**
     * Method to seek to a position on the audio track (in seconds),
     * @param position
     */
    public seekAudio(percentaje: number): void {
        this.audio.currentTime = percentaje*this.audio.duration/100
    }

    public getVolume() : number {
        return this.audio.volume
    }

    public setVolume(volume: number): void {
        this.audio.volume = volume
    }

    public getSongName(): String {
        if(this.actual_song){
          return this.actual_song.name
        }else{
          return ''
        }
    }

    public get_group_img(){
      this.restService.get_photo_group(this.actual_song.album.group).subscribe(
        res => {
            let reader = new FileReader();
            reader.addEventListener("load", () => {
              this.actual_img = reader.result.toString();
              console.log(this.actual_img)
            }, false);
            if (res) {
                reader.readAsDataURL(res);
            }
        },
        error => {
          console.log(error)
        }
      );
    }

    public getSong(): Song {
      return this.actual_song
    }

    /**
     * This formats the audio's elapsed time into a human readable format, could be refactored into a Pipe.
     * It takes the audio track's "currentTime" property as an argument. It is called from the, calulateTime method.
     * @param ct
     */
    private setTimeElapsed(ct: number): void {
        let seconds     = Math.floor(ct % 60),
            displaySecs = (seconds < 10) ? '0' + seconds : seconds,
            minutes     = Math.floor((ct / 60) % 60),
            displayMins = (minutes < 10) ? '0' + minutes : minutes;

        this.timeElapsed.next(displayMins + ':' + displaySecs);
    }

    /**
     * This method takes the track's "duration" and "currentTime" properties to calculate the remaing time the track has
     * left to play. It is called from the calculateTime method.
     * @param d
     * @param t
     */
    private setTimeRemaining(d: number, t: number): void {
        let remaining;
        let timeLeft = d - t,
            seconds = Math.floor(timeLeft % 60) || 0,
            remainingSeconds = seconds < 10 ? '0' + seconds : seconds,
            minutes = Math.floor((timeLeft / 60) % 60) || 0,
            remainingMinutes = minutes < 10 ? '0' + minutes : minutes,
            hours = Math.floor(((timeLeft / 60) / 60) % 60) || 0;

            // remaining = (hours === 0)
        if (hours === 0) {
            remaining = '-' + remainingMinutes + ':' + remainingSeconds;
        } else {
            remaining = '-' + hours + ':' + remainingMinutes + ':' + remainingSeconds;
        }
        this.timeRemaining.next(remaining);
    }

    /**
     * This method takes the track's "duration" and "currentTime" properties to calculate the percent of time elapsed.
     * This is valuable for setting the position of a range input. It is called from the calculateTime method.
     * @param d
     * @param ct
     */
    private setPercentElapsed(d: number, ct: number): void {
        this.percentElapsed.next(( Math.floor(( 100 / d ) * ct )) || 0 );
    }

    /**
     * This method takes the track's "duration" and "currentTime" properties to calculate the percent of time elapsed.
     * This is valuable for setting the position of a range input. It is called from the calculatePercentLoaded method.
     * @param p
     */
    private setPercentLoaded(p): void {
        this.percentLoaded.next(parseInt(p, 10) || 0 );
    }

    /**
     * This method returns an Observable whose value is the track's percent loaded
     */
    public getPercentLoaded(): Observable<number> {
        return this.percentLoaded.asObservable();
    }

    /**
     * This method returns an Observable whose value is the track's percent elapsed
     */
    public getPercentElapsed(): Observable<number> {
        return this.percentElapsed.asObservable();
    }

    public getPercentElapsedValue(): number {
        return this.percentElapsed.value
    }

    /**
     * This method returns an Observable whose value is the track's percent loaded
     */
    public getTimeElapsed(): Observable<string> {
        return this.timeElapsed.asObservable();
    }

    public getTimeElapsedValue(): String{
        return this.timeElapsed.value
    }

    /**
     * This method returns an Observable whose value is the track's time remaining
     */
    public getTimeRemaining(): Observable<string> {
        return this.timeRemaining.asObservable();
    }

    public getTimeRemainingValue(): String{
      return this.timeRemaining.value
    }

    /**
     * This method returns an Observable whose value is the current status of the player.
     * This is useful inside your component to key off certain values, for example:
     *   - Show pause button when player status is 'playing'
     *   - Show play button when player status is 'paused'
     *   - Show loading indicator when player status is 'loading'
     *
     * See the setPlayer method for values.
     */
    public getPlayerStatus(): Observable<string> {
        return this.playerStatus.asObservable();
    }

    public getAudioDuration(): String{
        let duration: String;
        let timeLeft = this.audio.duration,
            seconds = Math.floor(timeLeft % 60) || 0,
            remainingSeconds = seconds < 10 ? '0' + seconds : seconds,
            minutes = Math.floor((timeLeft / 60) % 60) || 0,
            remainingMinutes = minutes < 10 ? '0' + minutes : minutes,
            hours = Math.floor(((timeLeft / 60) / 60) % 60) || 0;

            // remaining = (hours === 0)
        if (hours === 0) {
            duration = remainingMinutes + ':' + remainingSeconds;
        } else {
            duration = hours + ':' + remainingMinutes + ':' + remainingSeconds;
        }
        return duration
    }

    /**
     * Convenience method to toggle the audio between playing and paused
     */
    public toggleAudio(): void {
        (this.audio.paused) ? this.audio.play() : this.audio.pause();
    }
}
