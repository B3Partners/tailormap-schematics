<% if(!httpService) {%>import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';<% } %>
<% if(httpService) {%>import { createHttpFactory, HttpMethod, SpectatorHttp } from '@ngneat/spectator/jest';<% } %>
import { <%= classify(name)%>Service } from './<%= dasherize(name)%>.service';

describe('<%= classify(name)%>Service', () => {
    <% if(!httpService) {%>
    let spectator: SpectatorService<<%= classify(name)%>Service>;
    const createService = createServiceFactory(<%= classify(name)%>Service);

    beforeEach(() => spectator = createService());

    test('should...', () => {
        expect(spectator.service).toBeTruthy();
    });
    <% } else { %>
    let spectator: SpectatorHttp<<%= classify(name)%>Service>;
    const createHttp = createHttpFactory(<%= classify(name)%>Service);

    beforeEach(() => spectator = createHttp());

    test('can test HttpClient.get', () => {
        // spectator.service.getTodos().subscribe();
        // spectator.expectOne('api/todos', HttpMethod.GET);
    });
    <% } %>
});
