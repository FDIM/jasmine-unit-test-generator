import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { <%=component %> } from '<%=path %>';<% 
    imports.forEach(function(value) { %>
import { <%=value.names.join(', ') %> } from <%=value.path %>;<% }) %>

describe('<%=component %>', () => {
    let component: <%=component %>;
    let fixture: ComponentFixture<<%=component %>>;<% 
        dependencies.forEach(function(dep) { %>
    let <%=dep.variableName %>: jasmine.SpyObj<<%=dep.type || 'any' %>>;<% }) %>

    beforeEach(async(() => {<% 
            dependencies.forEach(function(dep) { %>
        <%=dep.variableName %> = jasmine.createSpyObj<<%=dep.type || 'any' %>>('<%=dep.type || dep.name %>', ['<%=dep.usedMethods.join("', '")%>']);<% }) %>

        TestBed.configureTestingModule({
            declarations: [<%=component %>],
            providers: [<%
                dependencies.forEach(function(dep) { %>
                { provide: <%=dep.injectionToken %>, useFactory: () => <%=dep.variableName%> },<% }) %>
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(<%=component %>);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

});
