import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: [],
})
export class SearchBoxComponent implements OnInit{
  
  private debouncer: Subject<string> = new Subject<string>();

  @Input()
  public placeholder: string = '';

  @Output()
  public onValue = new EventEmitter<string>();

  @Output()
  public onDebounce = new EventEmitter<string>();

  ngOnInit(): void {
    this.debouncer
    .pipe(
      debounceTime(300) //Me espero 300ms para ver si recibo más valores
    )
    .subscribe( value => {
      this.onDebounce.emit( value );
    });
  }

  emitValue(term: string): void {    
    this.onValue.emit(term);
  }

  onKeyPress( searchTerm: string ){
    this.debouncer.next(searchTerm);
  }
}
