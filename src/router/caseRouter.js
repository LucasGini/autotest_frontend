import TestCaseView from "@/views/case/TestCaseView.vue";
import TestProjectView from "@/views/case/TestProjectView.vue";
import TestCaseEditView from "@/views/case/TestCaseEditView.vue";

const caseRoutes = [
    {
        path: '/case/testCase',
        name: 'testCase',
        component: TestCaseView,
        children: [
            {
                path:'edit',
                name: 'edit',
                component: TestCaseEditView
            }
        ]
    },
    {
        path: '/case/testProject',
        name: 'testProject',
        component: TestProjectView
    }
]

export default caseRoutes;