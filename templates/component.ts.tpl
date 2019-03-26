import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { <%=name %> } from '<%=path %>';<% 
    imports.forEach(function(value) { %>
import { <%=value.names.join(', ') %> } from <%=value.path %>;<% }) %>

describe('<%=name %>', () => {
    let <%=instanceVariableName %>: <%=name %>;
    let fixture: ComponentFixture<<%=name %>>;<% 
        dependencies.forEach(function(dep) { %>
    let <%=dep.variableName %>: jasmine.SpyObj<<%=dep.type || 'any' %>>;<% }) %>

    beforeEach(async(() => {<% 
            dependencies.forEach(function(dep) { %>
        <%=dep.variableName %> = jasmine.createSpyObj<<%=dep.type || 'any' %>>('<%=dep.type || dep.name %>', ['<%=dep.usedMethods.join("', '")%>']);<% }) %>

        TestBed.configureTestingModule({
            declarations: [<%=name %>],
            providers: [<%
                dependencies.forEach(function(dep) { %>
                { provide: <%=dep.injectionToken %>, useFactory: () => <%=dep.variableName%> },<% }) %>
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
