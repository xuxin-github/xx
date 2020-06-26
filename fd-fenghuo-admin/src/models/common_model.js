export default {
    namespace: 'common_model',

    state: {
        breadcrumb: {
            name: "",
            href: "",
            name01: "",
            href01: "",
            name02: "",
            href02: "",
            name03: "",
            href03: "",
            name04: "",
            href04: "",
            detail: "",
        },
        menu: {
            selectedKeys: [],
        },
        username: '',
        menuRoles: [],
    },

    reducers: {
        updateState(state, { payload }) {
            // console.info({ ...state, ...payload, })
            return {
                ...state,
                ...payload,
            }
        },
    }

}