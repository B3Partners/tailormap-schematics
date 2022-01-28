import { Injectable } from '@angular/core';<% if(httpService) {%>
import { HttpClient } from '@angular/common/http';<% } %>

@Injectable({
  providedIn: 'root',
})
export class <%= classify(name) %>Service {
<% if(httpService) {%>
  constructor(
    private httpClient: HttpClient,
  ) {
  }
<% } else {%>
  constructor() { }
<% } %>
}
