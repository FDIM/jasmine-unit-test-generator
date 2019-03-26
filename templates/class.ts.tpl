import { <%=name %> } from '<%=path %>';<% 
    imports.forEach(function(value) { %>
import { <%=value.names.join(', ') %> } from <%=value.path %>;<% }) %>

describe('<%=name %>', () => {
    let <%=instanceVariableName %>: <%=name %>;<% 
        dependencies.forEach(function(dep) { %>
    let <%=dep.variableName %>: jasmine.SpyObj<<%=dep.type || 'any' %>>;<% }) %>

    function create<%=templateType %>() {
        <%=instanceVariableName %> = new <%=name %>(<%
            dependencies.forEach(function(dep) { %>
            <%=dep.variableName%>,<% }) %>
        );
    }

    beforeEach(() => {<% 
            dependencies.forEach(function(dep) { %>
        <%=dep.variableName %> = jasmine.createSpyObj<<%=dep.type || 'any' %>>('<%=dep.type || dep.name %>', ['<%=dep.usedMethods.join("', '")%>']);<% }) %>

        create<%=templateType %>();
    });

    it('should create', () => {
        expect(<%=instanceVariableName %>).toBeTruthy();
    });

});
