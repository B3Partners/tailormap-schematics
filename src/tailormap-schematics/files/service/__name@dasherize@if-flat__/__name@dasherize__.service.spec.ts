<% if(httpService) {%>import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';<% } %>
import { TestBed } from '@angular/core/testing';
import { <%= classify(name)%>Service } from './<%= dasherize(name)%>.service';

describe('<%= classify(name)%>Service', () => {
<% if(!httpService) {%>
  let service: <%= classify(name)%>Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ <%= classify(name)%>Service ],
    });
    service = TestBed.inject(<%= classify(name)%>Service);
  });

  test('should...', () => {
    expect(service).toBeTruthy();
  });
<% } else { %>
  let service: <%= classify(name)%>Service;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ <%= classify(name)%>Service ],
    });
    service = TestBed.inject(<%= classify(name)%>Service);
    httpController = TestBed.inject(HttpTestingController);
  });

  test('can test HttpClient.get', () => {
    // service.getTodos().subscribe();
    // const req = httpController.expectOne({ url: 'api/todos', method: 'GET' });
    // req.flush(null);
  });
<% } %>
});
