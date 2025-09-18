package com.bestgroup.HomeEntertAInment.controller;

import com.bestgroup.HomeEntertAInment.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for Gemini API integration endpoints
 * Provides REST endpoints for interacting with Google's Gemini AI
 */
@CrossOrigin
@RestController
@RequestMapping("/api/gemini")
@RequiredArgsConstructor
public class GeminiController {

    private final GeminiService geminiService;

    /**
     * Status check endpoint to verify Gemini API connectivity
     * Sends a test prompt to Gemini and returns the response
     * @return ResponseEntity containing the Gemini API response
     */
    @GetMapping("/status")
    public ResponseEntity<String> status() {
        // Test prompt as specified in requirements
        String testPrompt = "This is just a status check. If you are receiving this, answer with a flat string being 'Online: Gemini Controller is up'.";
        
        // Send the test prompt to Gemini API
        String response = geminiService.sendTestPrompt(testPrompt);
        
        // Return the response from Gemini
        return ResponseEntity.ok(response);
    }
}
