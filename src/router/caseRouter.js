import TestCaseView from "@/views/case/TestCaseView.vue";
import TestProjectView from "@/views/case/TestProjectView.vue";

const caseRoutes = [
    {
        path: '/case/testCase',
        name: 'testCase',
        component: TestCaseView
    },
    {
        path: '/case/testProject',
        name: 'testProject',
        component: TestProjectView
    }
]

export default caseRoutes;