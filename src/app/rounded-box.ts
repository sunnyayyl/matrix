import {Component, input, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {NgOptimizedImage, NgStyle} from '@angular/common';

@Component({
  selector: "rounded-box",
  imports: [
    NgStyle
  ],
  template: `
    <svg [attr.height]="size()" [attr.width]="size()" xmlns="http://www.w3.org/2000/svg">
      <rect [attr.height]="size()" [attr.width]="size()" [attr.rx]="cornerRadius()" [attr.ry]="cornerRadius()"
            [attr.style]="'fill-opacity: 0;stroke-width:8;stroke:'+colour()"/>
    </svg>
  `,
})
export class RoundedBox {
  size=input.required<string>()
  colour=input.required<any>()
  cornerRadius=input("15")
}
