import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { <%=name %> } from '<%=path %>';<% 
    imports.forEach(function(value) { %>
import { <%=value.names.join(', ') %> } from <%=value.path %>;<% }) %>

describe('<%=name %>', () => {
    let <%=instanceVariableName %>: <%=name %>;
    let fixture: ComponentFixture<<%=name %>>;<% 
        declarations.forEach(function(dec) { %>
    let <%=dec.name %>: <%=dec.type %>;<% }) %>

    beforeEach(async(() => {<% 
            initializers.forEach(function(factory) { %>
        <%=(factory.name ? (factory.name + ' = ') : '') + factory.value%>;<% }) %>

        TestBed.configureTestingModule({
            declarations: [<%=name %>],
            providers: [<%
                dependencies.forEach(function(dep) { %>
                { provide: <%=dep.token %>, useFactory: () => <%=dep.name%> },<% }) %>
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(<%=name %>);
        <%=instanceVariableName %> = fixture.componentInstance;
    });

    it('should create', () => {
        expect(<%=instanceVariableName %>).toBeTruthy();
    });

});
