/*
  # User Vehicles Schema

  1. New Tables
    - `user_vehicles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `make` (text)
      - `model` (text)
      - `year` (text)
      - `color` (text)
      - `license_plate` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_vehicles` table
    - Add policies for:
      - Users can read their own vehicles
      - Users can create new vehicles
      - Users can update their own vehicles
      - Users can delete their own vehicles
*/

CREATE TABLE IF NOT EXISTS user_vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  year text NOT NULL,
  color text NOT NULL,
  license_plate text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_vehicles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own vehicles
CREATE POLICY "Users can read own vehicles"
  ON user_vehicles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can create vehicles
CREATE POLICY "Users can create vehicles"
  ON user_vehicles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own vehicles
CREATE POLICY "Users can update own vehicles"
  ON user_vehicles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own vehicles
CREATE POLICY "Users can delete own vehicles"
  ON user_vehicles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_user_vehicles_updated_at
  BEFORE UPDATE
  ON user_vehicles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();