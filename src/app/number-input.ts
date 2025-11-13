import {Component, input, model, output, ViewEncapsulation} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {RoundedBox} from './rounded-box';
import {CdkDrag, CdkDragDrop, CdkDragEnter, CdkDragExit, CdkDragPlaceholder, CdkDropList} from '@angular/cdk/drag-drop';
import {NgStyle} from '@angular/common';
import {Pos} from './matrix-grid';

@Component({
  selector: "number-input",
  imports: [
    MatFormFieldModule, MatInputModule, FormsModule, RoundedBox, CdkDrag, CdkDropList, NgStyle, CdkDragPlaceholder
  ],
  styles: [`
    .matrix-input input[type=number] {
      -moz-appearance: textfield;
    }

    .matrix-input input[type=number]::-webkit-outer-spin-button,
    .matrix-input input[type=number]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .matrix-input .mat-mdc-form-field-infix {
      height: 3rem !important;
      width: 3rem !important;
      display: flex;
      align-items: center;
      padding-top: unset !important;
      padding-bottom: unset !important;
      min-height: unset !important;
    }

    .matrix-input .mat-mdc-text-field-wrapper {
      padding: 0;
    }

    .matrix-input .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }
  `],
  template: `
    <div (cdkDropListEntered)="onDragEnter($event)" (cdkDropListExited)="onDragExit($event)"
         (cdkDropListDropped)="onDragDrop($event)" cdkDropList [cdkDropListData]="pos()">
      <div class="absolute z-99">
        @if (selected()) {
          <div [cdkDragBoundary]="dragBoundary()" cdkDrag [cdkDragDisabled]="!interactable()">
            <rounded-box size="3.5rem" [colour]="selectedColour()"/>
            <div class="hidden" *cdkDragPlaceholder></div>
          </div>
        } @else if (dragging || outlined()) {
          <div [ngStyle]="{'opacity': dragging?0.7: 1}">
            <rounded-box size="3.5rem" [colour]="dragging? selectedColour() : highlightedColour()"/>
          </div>
        }
      </div>
      <mat-form-field class="w-14 h-14 matrix-input" appearance="outline">
        <input matInput class="text-sm! text-center matrix-input" type="number" [(ngModel)]="value"/>
      </mat-form-field>
    </div>
  `,
  encapsulation: ViewEncapsulation.None
})
export class NumberInput {
  value = model.required<number>();
  selected = input(false);
  outlined = input(false);
  dragBoundary = input.required<string>();
  selectedColour = input("#F5BDE6");
  highlightedColour = input("#F5BDE6");
  pos = input.required<{ row: number, col: number }>();
  interactable = input(true);
  newSelection = output<Pos>();
  dragging = false
  draggingStateChanged=output<boolean>();

  onDragEnter<T = NumberInput>(event: CdkDragEnter<T>): void {
    this.setDragging(true);
  }

  onDragExit<T = NumberInput>(event: CdkDragExit<T>): void {
    this.setDragging(false);
  }

  onDragDrop<T = NumberInput>(event: CdkDragDrop<T>): void {
    this.setDragging(false);
    let data =  event.container.data;
    this.newSelection.emit(data as { row: number; col: number; })
  }

  setDragging(b: boolean): void {
    this.dragging = b;
    this.draggingStateChanged.emit(b)
  }

  protected readonly console = console;
}
