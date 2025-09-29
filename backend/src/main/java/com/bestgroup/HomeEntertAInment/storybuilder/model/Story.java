package com.bestgroup.HomeEntertAInment.storybuilder.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
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

    @ElementCollection(targetClass = Theme.class)
    @Enumerated(EnumType.STRING)
    private List<Theme> theme;

    @Enumerated(EnumType.STRING)
    private AgeGroup ageGroup;

    @Enumerated(EnumType.STRING)
    private StoryLength storyLength;

    @Enumerated(EnumType.STRING)
    private Twist twist;

    private String custom;

    @Column(columnDefinition = "TEXT")
    private String generatedStory;

    // User persistence fields
    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "cover_image_url")
    private String coverImageUrl;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
