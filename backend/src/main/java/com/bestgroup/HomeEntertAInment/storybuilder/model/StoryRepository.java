package com.bestgroup.HomeEntertAInment.storybuilder.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface StoryRepository extends JpaRepository<Story, UUID> {
}
