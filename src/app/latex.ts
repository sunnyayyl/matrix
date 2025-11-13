import {Component, computed, input} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

declare let katex: any;

@Component({
  selector: "latex",
  imports: [],
  template: `
    <div [innerHTML]="rendered()"></div>
  `,
})
export class Latex {
  math = input.required()
  rendered = computed(() => {
      console.log(this.math());
      return this.sanitizer.bypassSecurityTrustHtml(katex.renderToString(this.math(), {
        throwOnError: false
      }));
    }
  )

  constructor(private sanitizer: DomSanitizer) {
  }
}
