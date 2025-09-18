package com.bestgroup.HomeEntertAInment.boardgame.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO representing the response from ConvertAPI PDF to text conversion
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConvertApiResponseDto {
    
    /**
     * The cost of the conversion operation
     */
    private int conversionCost;
    
    /**
     * List of converted files
     */
    private List<ConvertedFile> files;
    
    /**
     * DTO representing a converted file
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ConvertedFile {
        
        /**
         * Name of the converted file
         */
        private String fileName;
        
        /**
         * File extension
         */
        private String fileExt;
        
        /**
         * Size of the file in bytes
         */
        private int fileSize;
        
        /**
         * Base64 encoded file data
         */
        private String fileData;
    }
}
