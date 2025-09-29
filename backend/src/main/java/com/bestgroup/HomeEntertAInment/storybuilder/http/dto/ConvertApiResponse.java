package com.bestgroup.HomeEntertAInment.storybuilder.http.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO representing the response from ConvertAPI for story PDF conversion
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConvertApiResponse {

    /**
     * The cost of the conversion operation
     */
    @JsonProperty("ConversionCost")
    private int conversionCost;

    /**
     * List of converted files
     */
    @JsonProperty("Files")
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
        @JsonProperty("FileName")
        private String fileName;

        /**
         * File extension
         */
        @JsonProperty("FileExt")
        private String fileExt;

        /**
         * Size of the file in bytes
         */
        @JsonProperty("FileSize")
        private int fileSize;

        /**
         * Base64 encoded file data
         */
        @JsonProperty("FileData")
        private String fileData;

        /**
         * URL to download the converted file
         */
        @JsonProperty("Url")
        private String url;
    }
}
