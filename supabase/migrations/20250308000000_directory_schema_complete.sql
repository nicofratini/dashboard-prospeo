-- Create extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for status
CREATE TYPE directory_item_status AS ENUM ('draft', 'pending', 'published', 'archived');

-- Create groups table
CREATE TABLE directory_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tags table
CREATE TABLE directory_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create directory items table
CREATE TABLE directory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  thumbnail_url TEXT,
  icon_url TEXT,
  url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  status directory_item_status DEFAULT 'pending',
  user_id UUID REFERENCES auth.users(id),
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  publish_planned_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB
);

-- Create junction table for items and groups (many-to-many)
CREATE TABLE directory_items_groups (
  item_id UUID REFERENCES directory_items(id) ON DELETE CASCADE,
  group_id UUID REFERENCES directory_groups(id) ON DELETE CASCADE,
  PRIMARY KEY (item_id, group_id)
);

-- Create junction table for items and tags (many-to-many)
CREATE TABLE directory_items_tags (
  item_id UUID REFERENCES directory_items(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES directory_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (item_id, tag_id)
);

-- Create table for user interactions (likes, saves, etc.)
CREATE TABLE directory_user_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID REFERENCES directory_items(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL, -- 'like', 'save', 'view', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, item_id, interaction_type)
);

-- Create table for comments
CREATE TABLE directory_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES directory_items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_directory_items_status ON directory_items(status);
CREATE INDEX idx_directory_items_featured ON directory_items(featured);
CREATE INDEX idx_directory_items_user_id ON directory_items(user_id);
CREATE INDEX idx_directory_items_created_at ON directory_items(created_at);
CREATE INDEX idx_directory_items_published_at ON directory_items(published_at);

-- Add full-text search capabilities
ALTER TABLE directory_items ADD COLUMN search_vector tsvector 
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(content, '')), 'C')
) STORED;

CREATE INDEX idx_directory_items_search ON directory_items USING GIN (search_vector);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_directory_items_updated_at
BEFORE UPDATE ON directory_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_directory_groups_updated_at
BEFORE UPDATE ON directory_groups
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_directory_tags_updated_at
BEFORE UPDATE ON directory_tags
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_directory_comments_updated_at
BEFORE UPDATE ON directory_comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security (RLS)
ALTER TABLE directory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE directory_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE directory_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE directory_items_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE directory_items_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE directory_user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE directory_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for directory_items
-- Anyone can read published items
CREATE POLICY "Published items are viewable by everyone" 
ON directory_items FOR SELECT 
USING (status = 'published');

-- Users can view their own items regardless of status
CREATE POLICY "Users can view their own items" 
ON directory_items FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own items
CREATE POLICY "Users can insert their own items" 
ON directory_items FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own items if not published
CREATE POLICY "Users can update their own draft or pending items" 
ON directory_items FOR UPDATE 
USING (auth.uid() = user_id AND status IN ('draft', 'pending'))
WITH CHECK (auth.uid() = user_id AND status IN ('draft', 'pending'));

-- Users can delete their own items if not published
CREATE POLICY "Users can delete their own draft or pending items" 
ON directory_items FOR DELETE 
USING (auth.uid() = user_id AND status IN ('draft', 'pending'));

-- Policies for directory_items_groups
-- Allow users to read relationships for their own items or published items
CREATE POLICY "Users can view group relationships for their items or published items"
ON directory_items_groups FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM directory_items
    WHERE id = directory_items_groups.item_id
    AND (user_id = auth.uid() OR status = 'published')
  )
);

-- Allow users to insert group relationships for their own items
CREATE POLICY "Users can insert group relationships for their items"
ON directory_items_groups FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM directory_items
    WHERE id = directory_items_groups.item_id
    AND user_id = auth.uid()
  )
);

-- Allow users to delete group relationships for their own items if not published
CREATE POLICY "Users can delete group relationships for their draft or pending items"
ON directory_items_groups FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM directory_items
    WHERE id = directory_items_groups.item_id
    AND user_id = auth.uid()
    AND status IN ('draft', 'pending')
  )
);

-- Policies for directory_items_tags
-- Allow users to read tag relationships for their own items or published items
CREATE POLICY "Users can view tag relationships for their items or published items"
ON directory_items_tags FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM directory_items
    WHERE id = directory_items_tags.item_id
    AND (user_id = auth.uid() OR status = 'published')
  )
);

-- Allow users to insert tag relationships for their own items
CREATE POLICY "Users can insert tag relationships for their items"
ON directory_items_tags FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM directory_items
    WHERE id = directory_items_tags.item_id
    AND user_id = auth.uid()
  )
);

-- Allow users to delete tag relationships for their own items if not published
CREATE POLICY "Users can delete tag relationships for their draft or pending items"
ON directory_items_tags FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM directory_items
    WHERE id = directory_items_tags.item_id
    AND user_id = auth.uid()
    AND status IN ('draft', 'pending')
  )
);

-- Insert some initial groups
INSERT INTO directory_groups (name, description) VALUES
('Technology', 'Technology resources and tools'),
('Design', 'Design resources and inspiration'),
('Operations', 'DevOps and operational resources'),
('Security', 'Security tools and best practices'),
('Research', 'Research papers and academic resources'),
('Finance', 'Financial tools and resources'),
('Creative', 'Creative tools and inspiration');

-- Insert some initial tags
INSERT INTO directory_tags (name) VALUES
('Development'),
('Web'),
('UI'),
('UX'),
('Mobile'),
('Data'),
('Science'),
('AI'),
('DevOps'),
('CI/CD'),
('Cloud'),
('Infrastructure'),
('Security'),
('Privacy'),
('Blockchain'),
('Crypto');

-- Function to increment views count
CREATE OR REPLACE FUNCTION increment_views_count(item_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE directory_items
  SET views_count = views_count + 1
  WHERE id = item_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment likes count
CREATE OR REPLACE FUNCTION increment_likes_count(item_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE directory_items
  SET likes_count = likes_count + 1
  WHERE id = item_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement likes count
CREATE OR REPLACE FUNCTION decrement_likes_count(item_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE directory_items
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = item_id;
END;
$$ LANGUAGE plpgsql;

-- Function to create a directory item with groups and tags in a transaction
CREATE OR REPLACE FUNCTION create_directory_item(
  item_data JSONB,
  group_ids UUID[],
  tag_ids UUID[]
)
RETURNS UUID AS $$
DECLARE
  new_item_id UUID;
BEGIN
  -- Insert the directory item
  INSERT INTO directory_items (
    title,
    description,
    content,
    image_url,
    thumbnail_url,
    url,
    featured,
    status,
    user_id,
    metadata
  )
  VALUES (
    item_data->>'title',
    item_data->>'description',
    item_data->>'content',
    item_data->>'image_url',
    item_data->>'thumbnail_url',
    item_data->>'url',
    (item_data->>'featured')::BOOLEAN,
    (item_data->>'status')::directory_item_status,
    (item_data->>'user_id')::UUID,
    item_data->'metadata'
  )
  RETURNING id INTO new_item_id;

  -- Insert group relationships
  IF array_length(group_ids, 1) > 0 THEN
    INSERT INTO directory_items_groups (item_id, group_id)
    SELECT new_item_id, unnest(group_ids);
  END IF;

  -- Insert tag relationships
  IF array_length(tag_ids, 1) > 0 THEN
    INSERT INTO directory_items_tags (item_id, tag_id)
    SELECT new_item_id, unnest(tag_ids);
  END IF;

  RETURN new_item_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update a directory item with groups and tags in a transaction
CREATE OR REPLACE FUNCTION update_directory_item(
  p_item_id UUID,
  item_updates JSONB,
  group_ids UUID[] DEFAULT NULL,
  tag_ids UUID[] DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  update_columns TEXT[] := '{}';
  update_values TEXT[] := '{}';
  update_sql TEXT;
BEGIN
  -- Build dynamic update SQL for the directory item
  IF item_updates ? 'title' THEN
    update_columns := array_append(update_columns, 'title');
    update_values := array_append(update_values, quote_literal(item_updates->>'title'));
  END IF;

  IF item_updates ? 'description' THEN
    update_columns := array_append(update_columns, 'description');
    update_values := array_append(update_values, quote_literal(item_updates->>'description'));
  END IF;

  IF item_updates ? 'content' THEN
    update_columns := array_append(update_columns, 'content');
    update_values := array_append(update_values, quote_literal(item_updates->>'content'));
  END IF;

  IF item_updates ? 'image_url' THEN
    update_columns := array_append(update_columns, 'image_url');
    update_values := array_append(update_values, quote_literal(item_updates->>'image_url'));
  END IF;

  IF item_updates ? 'thumbnail_url' THEN
    update_columns := array_append(update_columns, 'thumbnail_url');
    update_values := array_append(update_values, quote_literal(item_updates->>'thumbnail_url'));
  END IF;

  IF item_updates ? 'url' THEN
    update_columns := array_append(update_columns, 'url');
    update_values := array_append(update_values, quote_literal(item_updates->>'url'));
  END IF;

  IF item_updates ? 'featured' THEN
    update_columns := array_append(update_columns, 'featured');
    update_values := array_append(update_values, (item_updates->>'featured')::TEXT);
  END IF;

  IF item_updates ? 'status' THEN
    update_columns := array_append(update_columns, 'status');
    update_values := array_append(update_values, quote_literal(item_updates->>'status'));
  END IF;

  IF item_updates ? 'metadata' THEN
    update_columns := array_append(update_columns, 'metadata');
    update_values := array_append(update_values, item_updates->>'metadata');
  END IF;

  -- Add handling for publish_planned_at
  IF item_updates ? 'publish_planned_at' THEN
    update_columns := array_append(update_columns, 'publish_planned_at');
    IF item_updates->>'publish_planned_at' IS NULL THEN
      update_values := array_append(update_values, 'NULL');
    ELSE
      update_values := array_append(update_values, quote_literal(item_updates->>'publish_planned_at'));
    END IF;
  END IF;

  -- If status is changing to 'published', set published_at
  IF item_updates ? 'status' AND item_updates->>'status' = 'published' THEN
    update_columns := array_append(update_columns, 'published_at');
    update_values := array_append(update_values, 'NOW()');
  END IF;

  -- Execute the update if there are columns to update
  IF array_length(update_columns, 1) > 0 THEN
    update_sql := 'UPDATE directory_items SET ';
    
    FOR i IN 1..array_length(update_columns, 1) LOOP
      IF i > 1 THEN
        update_sql := update_sql || ', ';
      END IF;
      update_sql := update_sql || update_columns[i] || ' = ' || update_values[i];
    END LOOP;
    
    update_sql := update_sql || ' WHERE id = ' || quote_literal(p_item_id);
    
    EXECUTE update_sql;
  END IF;

  -- Update group relationships if provided
  IF group_ids IS NOT NULL THEN
    -- Delete existing relationships
    DELETE FROM directory_items_groups WHERE item_id = p_item_id;
    
    -- Insert new relationships
    IF array_length(group_ids, 1) > 0 THEN
      INSERT INTO directory_items_groups (item_id, group_id)
      SELECT p_item_id, unnest(group_ids);
    END IF;
  END IF;

  -- Update tag relationships if provided
  IF tag_ids IS NOT NULL THEN
    -- Delete existing relationships
    DELETE FROM directory_items_tags WHERE item_id = p_item_id;
    
    -- Insert new relationships
    IF array_length(tag_ids, 1) > 0 THEN
      INSERT INTO directory_items_tags (item_id, tag_id)
      SELECT p_item_id, unnest(tag_ids);
    END IF;
  END IF;

  RETURN p_item_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function for partial search using prefix matching
CREATE OR REPLACE FUNCTION directory_partial_search(search_term TEXT)
RETURNS SETOF directory_items AS $$
BEGIN
  -- Handle empty or null search query
  IF search_term IS NULL OR search_term = '' THEN
    RETURN QUERY SELECT * FROM directory_items LIMIT 0;
    RETURN;
  END IF;

  -- Process the search term to handle multiple words
  -- Replace spaces with & for AND logic between words
  DECLARE
    processed_term TEXT := regexp_replace(search_term, '\s+', '&', 'g');
  BEGIN
    -- Add :* suffix to each term for prefix matching
    processed_term := regexp_replace(processed_term, '([^&]+)', '\1:*', 'g');
    
    RETURN QUERY
    SELECT *
    FROM directory_items
    WHERE search_vector @@ to_tsquery('english', processed_term)
    AND status = 'published'
    ORDER BY ts_rank(search_vector, to_tsquery('english', processed_term)) DESC;
  END;
END;
$$ LANGUAGE plpgsql; 