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
     *
     * @return ResponseEntity containing the Gemini API response
     */
    @GetMapping("/status")
    public ResponseEntity<String> status() {
        String response = geminiService.sendTestPrompt();

        // Return the response from Gemini
        return ResponseEntity.ok(response);
    }
}
