package com.bestgroup.HomeEntertAInment.boardgame.utils;

import java.util.Base64;

/**
 * Utility class for decoding Base64 encoded strings to normal text.
 * This class provides static methods for Base64 decoding operations
 * used in the Board Game Rule Inspector functionality.
 */
public class DecodeBase64ToString {

    /**
     * Decodes a Base64 encoded string to normal text.
     * 
     * @param base64String The Base64 encoded string to decode
     * @return The decoded string in normal text format
     * @throws IllegalArgumentException if the input string is null or empty
     * @throws IllegalArgumentException if the input string is not valid Base64
     */
    public static String decode(String base64String) {
        if (base64String == null || base64String.trim().isEmpty()) {
            throw new IllegalArgumentException("Base64 string cannot be null or empty");
        }

        try {
            // Decode the Base64 string to bytes
            byte[] decodedBytes = Base64.getDecoder().decode(base64String);
            
            // Convert bytes to string using UTF-8 encoding
            return new String(decodedBytes, "UTF-8");
            
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid Base64 string: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Error decoding Base64 string: " + e.getMessage(), e);
        }
    }

    /**
     * Decodes a Base64 encoded string to normal text with custom charset.
     * 
     * @param base64String The Base64 encoded string to decode
     * @param charset The charset to use for decoding (e.g., "UTF-8", "ISO-8859-1")
     * @return The decoded string in normal text format
     * @throws IllegalArgumentException if the input string is null or empty
     * @throws IllegalArgumentException if the input string is not valid Base64
     * @throws IllegalArgumentException if the charset is not supported
     */
    public static String decode(String base64String, String charset) {
        if (base64String == null || base64String.trim().isEmpty()) {
            throw new IllegalArgumentException("Base64 string cannot be null or empty");
        }
        
        if (charset == null || charset.trim().isEmpty()) {
            throw new IllegalArgumentException("Charset cannot be null or empty");
        }

        try {
            // Decode the Base64 string to bytes
            byte[] decodedBytes = Base64.getDecoder().decode(base64String);
            
            // Convert bytes to string using specified charset
            return new String(decodedBytes, charset);
            
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid Base64 string: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Error decoding Base64 string with charset " + charset + ": " + e.getMessage(), e);
        }
    }

    /**
     * Validates if a string is valid Base64 format.
     * 
     * @param base64String The string to validate
     * @return true if the string is valid Base64, false otherwise
     */
    public static boolean isValidBase64(String base64String) {
        if (base64String == null || base64String.trim().isEmpty()) {
            return false;
        }

        try {
            Base64.getDecoder().decode(base64String);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
