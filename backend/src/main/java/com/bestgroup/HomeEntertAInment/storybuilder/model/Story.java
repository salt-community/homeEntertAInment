package com.bestgroup.HomeEntertAInment.storybuilder.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Entity
@Getter
@Service
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "stories")
public class Story {
    @Id
    @GeneratedValue()
    private UUID id;

    private String character;

    @Enumerated(EnumType.STRING)
    private Theme theme;

    @Enumerated(EnumType.STRING)
    private AgeGroup ageGroup;

    @Enumerated(EnumType.STRING)
    private Twist twist;

    private String custom;

    @Lob
    private String generatedStory;
}
