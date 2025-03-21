/*
  # Service Requests Schema

  1. New Tables
    - `service_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `service_type` (text)
      - `status` (text)
      - `location_address` (text)
      - `location_latitude` (double precision)
      - `location_longitude` (double precision)
      - `vehicle_make` (text)
      - `vehicle_model` (text)
      - `vehicle_year` (text)
      - `vehicle_color` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `service_requests` table
    - Add policies for:
      - Users can read their own requests
      - Users can create new requests
      - Users can update their own requests
*/

CREATE TABLE IF NOT EXISTS service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  service_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  location_address text NOT NULL,
  location_latitude double precision NOT NULL,
  location_longitude double precision NOT NULL,
  vehicle_make text NOT NULL,
  vehicle_model text NOT NULL,
  vehicle_year text NOT NULL,
  vehicle_color text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own requests
CREATE POLICY "Users can read own requests"
  ON service_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can create new requests
CREATE POLICY "Users can create requests"
  ON service_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own requests
CREATE POLICY "Users can update own requests"
  ON service_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_service_requests_updated_at
  BEFORE UPDATE
  ON service_requests
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();