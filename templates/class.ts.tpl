import { <%=name %> } from '<%=path %>';<% 
    imports.forEach(function(value) { %>
import { <%=value.names.join(', ') %> } from <%=value.path %>;<% }) %>

describe('<%=name %>', () => {
    let <%=instanceVariableName %>: <%=name %>;<% 
        declarations.forEach(function(dec) { %>
    let <%=dec.name %>: <%=dec.type %>;<% }) %>

    function create<%=templateType %>() {
        <%=instanceVariableName %> = new <%=name %>(<%
            dependencies.forEach(function(dep) { %>
            <%=dep.name%>,<% }) %>
        );
    }

    beforeEach(() => {<% 
            factories.forEach(function(factory) { %>
        <%=factory.name %> = <%=factory.value %>;<% }) %>

        create<%=templateType %>();
    });

    it('should create', () => {
        expect(<%=instanceVariableName %>).toBeTruthy();
    });

});
