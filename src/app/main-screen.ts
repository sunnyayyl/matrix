import {Component, model} from '@angular/core';
import {add, calculateOutline, MatrixGrid, Pos} from './matrix-grid';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Latex} from './latex';

@Component({
  selector: 'main-screen',
  imports: [
    MatButtonModule,
    MatrixGrid,
    MatIconModule,
    Latex
  ],
  template: `
    <div class="flex flex-col items-center justify-center overflow-hidden">
        <label class="font-bold pb-3">
          Matrix Determinant
        </label>
        <matrix-grid [(matrix)]="matrix" [interactable]="!playing" [(selected)]="selected"
                     (outlineCalculated)="newOutline($event)" (selectedChange)="newSelectionByUser($event)"
                     (draggingStateChanged)="reset()"/>
        <div>
          <button class="justify-self-start" mat-button="filled" (click)="play()"
                  [disabled]="playing||selected().row>=5">
            <mat-icon>play_arrow</mat-icon>
            Play
          </button>
        </div>
        <latex
          math="\\begin{aligned}
                    &{{ ifNull(a[0]?.toString(), '?') }}\\times{{ toLatexMatrix(b[0]) }}+{{  ifNull(a[1]?.toString(), '?') }}\\times{{ toLatexMatrix(b[1]) }}+{{ ifNull(a[2]?.toString(), '?') }}\\times{{ toLatexMatrix(b[2]) }}\\\\
                    {{result}}
                \\end{aligned}"/>
    </div>
  `,
})
export class MainScreen {
  animationProgress: 0 | 1 | 2 = 0
  matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  playing = false;
  b: ({ pos: Pos, value: number }[][] | null)[] = [null, null, null];
  result = ""
  protected selected = model<Pos>({row: 0, col: 0});
  a: (number | null)[] = [this.matrix[this.selected().row % 3][this.selected().col % 3], null, null]
  protected readonly toLatexMatrix = toLatexMatrix;

  play() {
    this.reset()
    this.playing = true;
    this.playAnimation().then();
  }

  async playAnimation(): Promise<void> {
    this.playing = true;
    await asyncSetTimeout(400);
    this.animationProgress = 1
    this.advanceSelectionToNext()
    await asyncSetTimeout(400);
    this.animationProgress = 2
    this.advanceSelectionToNext()
    await asyncSetTimeout(200);
    this.playing = false;
    this.result = this.calculateResult()
    this.animationProgress = 0
  }

  newOutline(e: { pos: Pos, value: number }[][] | null) {
    this.b[this.animationProgress] = e
  }

  advanceSelectionToNext() {
    this.selected.set(add(this.selected(), {row: 1, col: 0}));
    this.newSelectionByUser(this.selected())
  }

  newSelectionByUser(e: Pos) {
    this.a[this.animationProgress] = (this.matrix[e.row % 3][e.col % 3]);
  }

  calculateResult(): string {
    if (this.a[2] !== null && this.b[2] !== null) {
      var result = 0;
      for (let i = 0; i < 3; i++) {
        const m = this.b[i]!
        result += this.a[i]! * (m[0][0].value * m[1][1].value - m[1][0].value * m[0][1].value)
      }
      return `\\\\&=${result}`
    }
    return ""
  }

  protected readonly ifNull = ifNull;

  reset() {
    this.a = [this.matrix[this.selected().row % 3][this.selected().col % 3], null, null];
    this.b = [calculateOutline(this.selected(), this.matrix), null, null];
    this.result = "";
  }
}

function asyncSetTimeout(ms: number): Promise<number> {
  return new Promise(res => setTimeout(res, ms));
}

const unknown = "\\begin{bmatrix}?&?\\\\?&?\\\\\\end{bmatrix}"

function toLatexMatrix(matrix: { pos: Pos, value: number }[][] | null): string {
  if (matrix === null) {
    return unknown;
  }
  let result = "\\begin{bmatrix}";
  for (let y = 0; y < 2; y++) {
    let row = matrix[y];
    for (let x = 0; x < 2; x++) {
      if (row === undefined) {
        result += "?&"
        continue;
      }
      const item = row[x];
      if (item === undefined) {
        result += "?&"
      } else {
        result += `${item.value}&`;
      }
    }
    result = result.slice(0, result.length - 1);
    result += "\\\\";
  }
  return result + "\\end{bmatrix}";
}

function ifNull<T>(v: T | null, replacement: T): T {
  if (v === null) {
    return replacement;
  }
  return v;
}
