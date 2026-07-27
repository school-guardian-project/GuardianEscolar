export const roleConfig = {
    student: {
        topBar: {
            showSearchInput: true,
            showNotifications: true,
        },
        card: {
            showNearbyRoutes: true, // Rutas cercanas
            showStop: true,
            showQR: true,
            qrMode: 'activate'
        },
        MapMarkers: 'own'
    },

    driver: {
        topBar: {
            showSearchInput: false,
            showNotifications: true,
        },
        card: {
            showNearbyRoutes: true, // Rutas cercanas
            showStop: true,
            showQR: true,
            qrMode: 'scan'
        },
        MapMarkers: 'all-students'
    },

    father: {
        topBar: {
            showSearchInput: false,
            showNotifications: true,
        },
        card: {
            showNearbyRoutes: false, // Rutas cercanas
            showStop: true,
            showQR: false,
            qrMode: null
        },
        MapMarkers: 'child-only'
    }
}

export const VALID_ROLES = Object.keys(roleConfig);