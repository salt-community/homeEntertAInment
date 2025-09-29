package com.bestgroup.HomeEntertAInment.storybuilder.http.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing a request to convert markdown content to PDF for stories
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarkdownToPdfRequest {

    /**
     * The markdown content to convert to PDF
     */
    private String markdownContent;

    /**
     * Optional cover image URL to include in the PDF
     */
    private String coverImageUrl;
}
