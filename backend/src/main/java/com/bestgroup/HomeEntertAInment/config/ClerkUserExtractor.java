package com.bestgroup.HomeEntertAInment.config;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

/**
 * Utility class for extracting Clerk user information from JWT tokens
 */
@Component
public class ClerkUserExtractor {

    /**
     * Extract Clerk user ID from the authentication context
     *
     * @param authentication The Spring Security authentication object
     * @return The Clerk user ID, or null if not found
     */
    public String extractClerkUserId(Authentication authentication) {
        if (authentication == null) {
            return null;
        }

        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            Jwt jwt = jwtAuth.getToken();
            return jwt.getClaimAsString("sub"); // Clerk uses 'sub' claim for user ID
        }

        return null;
    }

    /**
     * Extract Clerk user ID from the authentication context with validation
     *
     * @param authentication The Spring Security authentication object
     * @return The Clerk user ID
     * @throws IllegalStateException if user ID cannot be extracted
     */
    public String extractClerkUserIdRequired(Authentication authentication) {
        String userId = extractClerkUserId(authentication);
        if (userId == null || userId.trim().isEmpty()) {
            throw new IllegalStateException("Unable to extract Clerk user ID from authentication");
        }
        return userId;
    }
}
