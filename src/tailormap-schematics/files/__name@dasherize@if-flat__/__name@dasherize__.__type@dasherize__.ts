
import { Component, OnInit<% if(!!viewEncapsulation) { %>, ViewEncapsulation<% }%><% if(changeDetection !== 'Default') { %>, ChangeDetectionStrategy<% }%> } from '@angular/core';

@Component({<% if(!skipSelector) {%>
  selector: '<%= selector %>',<%}%><% if(inlineTemplate) { %>
  template: `
    <p>
      <%= dasherize(name) %> works!
    </p>
  `,<% } else { %>
  templateUrl: './<%= dasherize(name) %><%= type ? '.' + dasherize(type): '' %>.html',<% } if(inlineStyle) { %>
  styles: [<% if(displayBlock){ %>
    `
      :host {
        display: block;
      }
    `<% } %>
  ]<% } else if (style !== 'none') { %>
  styleUrls: ['./<%= dasherize(name) %><%= type ? '.' + dasherize(type): '' %>.<%= style %>'],<% } %><% if(!!viewEncapsulation) { %>
  encapsulation: ViewEncapsulation.<%= viewEncapsulation %>,<% } if (changeDetection !== 'Default') { %>
  changeDetection: ChangeDetectionStrategy.<%= changeDetection %>,<% } %>
})
export class <%= classify(name) %><%= classify(type) %> implements OnInit {

  constructor() { }

  public ngOnInit(): void {
  }

}
