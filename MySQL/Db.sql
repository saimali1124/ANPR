CREATE DATABASE anpr;
USE anpr;

CREATE TABLE number_plates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  plate_number VARCHAR(255) NOT NULL,
  detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add the new column cameraID
ALTER TABLE number_plates
ADD COLUMN cameraID INT;

-- To verify the changes
SELECT * FROM number_plates;

select * from number_plates;

TRUNCATE TABLE number_plates;