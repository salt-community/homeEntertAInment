package com.bestgroup.HomeEntertAInment.boardgame.utils;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Test class for DecodeBase64ToString utility.
 * Tests the Base64 decoding functionality for the Board Game Rule Inspector.
 */
class DecodeBase64ToStringTest {

    @Test
    void testDecodeValidBase64String() {
        // Test with a simple string
        String originalText = "Hello, World!";
        String base64Encoded = java.util.Base64.getEncoder().encodeToString(originalText.getBytes());
        
        String decoded = DecodeBase64ToString.decode(base64Encoded);
        
        assertEquals(originalText, decoded);
    }

    @Test
    void testDecodeWithCustomCharset() {
        // Test with UTF-8 charset
        String originalText = "Hello, 世界!";
        String base64Encoded = java.util.Base64.getEncoder().encodeToString(originalText.getBytes());
        
        String decoded = DecodeBase64ToString.decode(base64Encoded, "UTF-8");
        
        assertEquals(originalText, decoded);
    }

    @Test
    void testDecodeNullString() {
        assertThrows(IllegalArgumentException.class, () -> {
            DecodeBase64ToString.decode(null);
        });
    }

    @Test
    void testDecodeEmptyString() {
        assertThrows(IllegalArgumentException.class, () -> {
            DecodeBase64ToString.decode("");
        });
    }

    @Test
    void testDecodeInvalidBase64() {
        assertThrows(IllegalArgumentException.class, () -> {
            DecodeBase64ToString.decode("This is not valid base64!");
        });
    }

    @Test
    void testIsValidBase64WithValidString() {
        String validBase64 = java.util.Base64.getEncoder().encodeToString("test".getBytes());
        assertTrue(DecodeBase64ToString.isValidBase64(validBase64));
    }

    @Test
    void testIsValidBase64WithInvalidString() {
        assertFalse(DecodeBase64ToString.isValidBase64("This is not valid base64!"));
    }

    @Test
    void testIsValidBase64WithNullString() {
        assertFalse(DecodeBase64ToString.isValidBase64(null));
    }

    @Test
    void testIsValidBase64WithEmptyString() {
        assertFalse(DecodeBase64ToString.isValidBase64(""));
    }

    @Test
    void testDecodeWithNullCharset() {
        String base64String = java.util.Base64.getEncoder().encodeToString("test".getBytes());
        
        assertThrows(IllegalArgumentException.class, () -> {
            DecodeBase64ToString.decode(base64String, null);
        });
    }

    @Test
    void testDecodeWithEmptyCharset() {
        String base64String = java.util.Base64.getEncoder().encodeToString("test".getBytes());
        
        assertThrows(IllegalArgumentException.class, () -> {
            DecodeBase64ToString.decode(base64String, "");
        });
    }
}
