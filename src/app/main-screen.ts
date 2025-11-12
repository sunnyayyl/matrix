import {Component, computed, model} from '@angular/core';
import {NumberInput} from './number-input';
import {CdkDrag, CdkDropListGroup} from "@angular/cdk/drag-drop"
import {NgStyle} from '@angular/common';

@Component({
  selector: 'main-screen',
  imports: [
    NumberInput,
    CdkDrag,
    CdkDropListGroup,
    NgStyle
  ],
  template: `
    <div class="flex h-screen flex-col items-center justify-center">
      <div class="flex flex-col">
        <label class="font-bold pb-3">
          Matrix
        </label>
        <div class="flex flex-col matrix" cdkDropListGroup>
          @for (r of range(7); track r) {
            <div class="flex flex-row" [ngStyle]="{'padding-bottom': (r+1)%3==0? '8px': '0'}">
              @for (c of range(7); track c; ) {
                <number-input [(value)]="matrix[r%3][c%3]"
                              [selected]="isSelected({x:r,y:c})"
                              [outlined]="isVisible({x:r,y:c})&&!dragging"
                              dragBoundary=".matrix"
                              [ngStyle]="{'padding-right': (c+1)%3==0? '8px': '0'}"
                              [eId]="{x:r,y:c}"
                              (newSelection)="updateSelection($event)"
                              (draggingStateChanged)="dragging=$event"/>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class MainScreen {
  protected readonly range = range;
  selected = {x: 0, y: 0};
  matrix= [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  dragging=false;
  isSelected(pos: {x: number, y: number}): boolean {
    return this.selected.x === pos.x&&this.selected.y === pos.y;
  }
  isVisible(pos: {x: number, y: number}): boolean {
    return (pos.x - this.selected.x>0&&pos.x - this.selected.x <= 2) && (pos.y - this.selected.y>0&&pos.y - this.selected.y <= 2) && !(pos.x === this.selected.x || pos.y === this.selected.y);
  }
  updateSelection(pos: {x: number, y: number}): void {
    this.selected=pos;
  }
}

function* range(n: number) {
  let i = 0;
  while (i < n) {
    yield i;
    i++;
  }
}
