package com.bestgroup.HomeEntertAInment.boardgame.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing the decoded response from ConvertAPI PDF to text conversion
 * This model includes both the original coded data and the decoded text content
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DecodedConvertApiResponse {

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
     * Base64 encoded file data (original coded data from ConvertApiResponseDto)
     */
    private String codedData;

    /**
     * Decoded text content from the Base64 encoded file data
     */
    private String decodedData;
}
