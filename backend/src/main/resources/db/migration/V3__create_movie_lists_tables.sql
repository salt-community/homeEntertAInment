-- Create movie_lists table
CREATE TABLE movie_lists (
    id BIGSERIAL PRIMARY KEY,
    clerk_user_id VARCHAR(255) NOT NULL,
    list_name VARCHAR(255) NOT NULL,
    description TEXT,
    search_criteria TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create movie_list_items table
CREATE TABLE movie_list_items (
    id BIGSERIAL PRIMARY KEY,
    movie_list_id BIGINT NOT NULL REFERENCES movie_lists(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    year INTEGER,
    imdb_id VARCHAR(255),
    rating DECIMAL(3,1),
    age_rating VARCHAR(10),
    duration INTEGER,
    director VARCHAR(255),
    genres TEXT, -- JSON string
    movie_cast TEXT, -- JSON string
    description TEXT,
    recommendation_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_movie_lists_clerk_user_id ON movie_lists(clerk_user_id);
CREATE INDEX idx_movie_lists_created_at ON movie_lists(created_at DESC);
CREATE INDEX idx_movie_list_items_movie_list_id ON movie_list_items(movie_list_id);
