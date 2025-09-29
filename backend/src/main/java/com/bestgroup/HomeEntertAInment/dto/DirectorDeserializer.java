package com.bestgroup.HomeEntertAInment.dto;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;

import java.io.IOException;
import java.util.Iterator;

public class DirectorDeserializer extends JsonDeserializer<String> {
    
    @Override
    public String deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JsonProcessingException {
        JsonNode node = p.getCodec().readTree(p);
        
        if (node.isArray()) {
            // If it's an array, join with ", "
            StringBuilder sb = new StringBuilder();
            Iterator<JsonNode> elements = node.elements();
            while (elements.hasNext()) {
                if (sb.length() > 0) {
                    sb.append(", ");
                }
                sb.append(elements.next().asText());
            }
            return sb.toString();
        } else if (node.isTextual()) {
            // If it's already a string, return as is
            return node.asText();
        } else {
            // Fallback to empty string
            return "";
        }
    }
}
