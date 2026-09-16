// [SIMULATE-API-BACKEND] Exportaciones principales
// Esta carpeta contiene la lógica de negocio aislada del frontend

// Configuración
export { API_CONFIG, ENDPOINTS } from './config/api.config.js';
export { MOCK_API_CONFIG, MOCK_ENDPOINTS } from './config/mock-api.config.ts';

// Servicios de autenticación
export { authService, dashboardService } from './services/auth/services.js';
export { profileUpdateService } from './services/auth/profileUpdate.service.js';
export { MockAuthService } from './services/auth/mock-auth.service.ts';
export { ProfileUpdateService } from './services/auth/profile-update.service.ts';

// Servicios de API
export { apiClient, createResource } from './services/api/api.client.js';
export { validateEmail, validatePassword, sanitizeQuery } from './services/api/api.validators.js';
export { ApiError, ValidationError } from './services/api/api.errors.js';

// Servicios mock-api
export { MockApiService } from './services/mock-api/mock-api.service.ts';
export { CardListDataService } from './services/mock-api/card-list.data.service.ts';

// Mappers
export * from './services/mappers/card-list.mapper.ts';

// Endpoints compartidos
export { ENDPOINTS as SHARED_ENDPOINTS, ROLE_MAP, ROLE_TYPE_MAP } from './shared/endpoints.js';
