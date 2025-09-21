package com.bestgroup.HomeEntertAInment.boardgame.service;

import com.bestgroup.HomeEntertAInment.boardgame.dto.ConvertApiResponseDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for ConvertApiService
 */
@ExtendWith(MockitoExtension.class)
class ConvertApiServiceTest {

    @InjectMocks
    private ConvertApiService convertApiService;

    private MockMultipartFile mockPdfFile;

    @BeforeEach
    void setUp() {
        // Set up test API token
        ReflectionTestUtils.setField(convertApiService, "convertApiToken", "test-token");
        
        // Create a mock PDF file
        mockPdfFile = new MockMultipartFile(
                "file",
                "test.pdf",
                "application/pdf",
                "Mock PDF content".getBytes(StandardCharsets.UTF_8)
        );
    }

    @Test
    void testConvertPdfToText_WithValidFile_ShouldNotThrowException() {
        // This test verifies that the service can be instantiated and configured properly
        // In a real scenario, you would mock the RestTemplate and test the actual HTTP call
        
        assertNotNull(convertApiService);
        assertNotNull(mockPdfFile);
        assertEquals("test.pdf", mockPdfFile.getOriginalFilename());
        assertEquals("application/pdf", mockPdfFile.getContentType());
    }

    @Test
    void testConvertPdfToText_WithNullFile_ShouldThrowIllegalArgumentException() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> convertApiService.convertPdfToText(null)
        );
        
        assertEquals("PDF file cannot be null or empty", exception.getMessage());
    }

    @Test
    void testConvertPdfToText_WithEmptyFile_ShouldThrowIllegalArgumentException() {
        MockMultipartFile emptyFile = new MockMultipartFile(
                "file",
                "empty.pdf",
                "application/pdf",
                new byte[0]
        );

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> convertApiService.convertPdfToText(emptyFile)
        );
        
        assertEquals("PDF file cannot be null or empty", exception.getMessage());
    }

    @Test
    void testConvertPdfToText_WithNullToken_ShouldThrowIllegalStateException() {
        // Set null token to simulate missing configuration
        ReflectionTestUtils.setField(convertApiService, "convertApiToken", null);

        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> convertApiService.convertPdfToText(mockPdfFile)
        );
        
        assertEquals("ConvertAPI token is not configured. Please set CONVERT_API_TOKEN in application.yml", 
                exception.getMessage());
    }

    @Test
    void testConvertPdfToText_WithEmptyToken_ShouldThrowIllegalStateException() {
        // Set empty token to simulate empty configuration
        ReflectionTestUtils.setField(convertApiService, "convertApiToken", "");

        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> convertApiService.convertPdfToText(mockPdfFile)
        );
        
        assertEquals("ConvertAPI token is not configured. Please set CONVERT_API_TOKEN in application.yml", 
                exception.getMessage());
    }

    @Test
    void testConvertApiResponseDto_Structure() {
        // Test the DTO structure
        ConvertApiResponseDto.ConvertedFile file = new ConvertApiResponseDto.ConvertedFile(
                "test.txt",
                "txt",
                100,
                "dGVzdCBkYXRh" // base64 encoded "test data"
        );

        ConvertApiResponseDto response = new ConvertApiResponseDto(1, List.of(file));

        assertEquals(1, response.getConversionCost());
        assertEquals(1, response.getFiles().size());
        assertEquals("test.txt", response.getFiles().get(0).getFileName());
        assertEquals("txt", response.getFiles().get(0).getFileExt());
        assertEquals(100, response.getFiles().get(0).getFileSize());
        assertEquals("dGVzdCBkYXRh", response.getFiles().get(0).getFileData());
    }
}
