import {Component, computed, effect, input, model, output} from '@angular/core';
import {NumberInput} from './number-input';
import {CdkDropListGroup} from "@angular/cdk/drag-drop"
import {NgStyle} from '@angular/common';

@Component({
  selector: 'matrix-grid',
  imports: [
    NumberInput,
    CdkDropListGroup,
    NgStyle
  ],
  template: `
    <div class="flex flex-col matrix" cdkDropListGroup>
      @for (r of range(); track r) {
        <div class="flex flex-row" [ngStyle]="{'padding-bottom': (r+1)%3==0? '8px': '0'}">
          @for (c of range(); track c; ) {
            <number-input [(value)]="matrix()[r%3][c%3]"
                          [selected]="isSelected({row:r,col:c})"
                          [outlined]="isOutlined({row:r,col:c})&&!dragging"
                          dragBoundary=".matrix"
                          [ngStyle]="{'padding-right': (c+1)%3==0? '8px': '0'}"
                          [pos]="{row:r,col:c}"
                          (newSelection)="updateSelection($event)"
                          (draggingStateChanged)="dragging=$event;this.draggingStateChanged.emit()"
                          [interactable]="interactable()"/>
          }
        </div>
      }
    </div>
  `,
})
export class MatrixGrid {
  range = computed(() => Array.from(range(7)));
  selected = model<Pos>({row: 0, col: 0});
  draggingStateChanged = output()
  outlineCalculated = output<{ pos: Pos, value: number }[][] | null>();
  matrix = model.required<number[][]>();
  interactable = input(true)
  dragging = false;
  outlined = computed(() => {
    if (this.dragging) {
      return null
    }
    const outlined: { pos: Pos, value: number }[][] = []
    const selected = this.selected();
    const start = add(selected, {row: 1, col: 1});
    for (let r = 0; r < 2; r++) {
      const row = []
      for (let c = 0; c < 2; c++) {
        const current = add(start, {row: r, col: c});
        const value = this.matrix()[current.row % 3][current.col % 3];
        row.push({pos: current, value})
      }
      outlined.push(row)
    }
    console.log(outlined)
    return outlined
  });

  constructor() {
    effect(() => {
      this.outlineCalculated.emit(this.outlined())
    });
  }

  isSelected(pos: Pos): boolean {
    return equals(this.selected(), pos);
  }

  isOutlined(pos: Pos): boolean {
    const outlined = this.outlined();
    if (outlined === null) {
      return false
    }
    for (const r of outlined) {
      for (const p of r) {
        if (equals(pos, p.pos)) {
          return true;
        }
      }
    }
    return false;
  }

  updateSelection(pos: Pos): void {
    this.selected.set(pos);
  }
}

export type Pos = { row: number, col: number };

function* range(n: number) {
  let i = 0;
  while (i < n) {
    yield i;
    i++;
  }
}

function equals(a: Pos, b: Pos) {
  return a.row === b.row && a.col === b.col;
}

export function add(a: Pos, b: Pos): Pos {
  return {row: a.row + b.row, col: a.col + b.col};
}
