import { Directive, Renderer, ElementRef, HostListener, Input } from '@angular/core';
import  moment from 'moment';

@Directive({
  selector: '[time-convert]'
})
export class TimeConvertDirective {

  constructor(
    public renderer: Renderer, 
    public elementRef: ElementRef
  ) {
    console.log('Hello TimeConvertDirective Directive');
  }


  ngOnInit() {
    const spanTag = this.elementRef.nativeElement.querySelector('span');
    console.log(spanTag);
  }

  @Input('time-convert') time: string;

  @HostListener('mouseenter') onmouseenter() {
    this.highlight(this.time || 'red');
  }

  @HostListener('mouseleave') onmouseleave() {
    this.highlight(null);
  }

  private highlight(color: string) {
    this.elementRef.nativeElement.style.backgroundColor = color;
  }

  convertMinutes(value) {
    let minutes = moment.duration(value).minutes()
    return minutes;
  }

  convertSeconds(value) {
    let seconds = value % 60;
    return seconds;
  }

}
