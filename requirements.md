# Requirements Document

## Introduction

The Admin Dashboard is a private, owner-only interface for the MAC Media website. It gives the site owner a single place to monitor site activity and visitor analytics, create and update content across all seven pages (index, about, education, movies, music, sports, contact), and navigate to any page of the live site. The dashboard is implemented as a standalone HTML page (`admin.html`) that lives alongside the existing static files, uses a client-side PIN-based authentication guard, and manipulates page content through `localStorage` so no server-side backend is required beyond the existing PHP contact handler.

---

## Glossary

- **Dashboard**: The admin interface served at `admin.html`.
- **Owner**: The single authenticated administrator of the MAC Media website.
- **Session**: A browser session during which the Owner has successfully entered the correct PIN.
- **Content_Item**: A discrete piece of displayable content — a movie card, a music card, a course card, a sports news card, or a featured spotlight entry.
- **Content_Store**: The `localStorage` key-value store used to persist Content_Items added or removed by the Owner.
- **Analytics_Widget**: A UI component on the Dashboard that displays a visitor or engagement metric.
- **Page_Link**: A direct hyperlink to one of the seven public pages of the MAC Media site.
- **Activity_Log**: A time-stamped record of owner actions (content additions, deletions, edits) stored in `localStorage`.
- **PIN**: A numeric password used to authenticate the Owner before granting Dashboard access.
- **Validator**: The client-side module that checks the entered PIN against the stored PIN hash.
- **Content_Editor**: The Dashboard module responsible for creating, editing, and deleting Content_Items.
- **Nav_Panel**: The Dashboard section that displays Page_Links to all public pages.
- **Overview_Panel**: The Dashboard section that displays Analytics_Widgets and the Activity_Log.

---

## Requirements

### Requirement 1: Owner Authentication

**User Story:** As the Owner, I want to log in to the Dashboard with a PIN so that unauthorized visitors cannot access or modify site content.

#### Acceptance Criteria

1. THE Dashboard SHALL display a PIN entry screen before revealing any dashboard content.
2. WHEN the Owner submits a correct PIN, THE Validator SHALL grant access and render the full Dashboard within 300 ms.
3. WHEN the Owner submits an incorrect PIN, THE Validator SHALL display an error message and clear the PIN input field without revealing any dashboard content.
4. IF an incorrect PIN is submitted 5 consecutive times, THEN THE Validator SHALL lock the PIN entry screen for 60 seconds and display a countdown timer.
5. WHILE a valid Session exists in `sessionStorage`, THE Dashboard SHALL skip the PIN entry screen and render the full Dashboard directly.
6. WHEN the Owner clicks the logout control, THE Dashboard SHALL clear the Session from `sessionStorage` and return to the PIN entry screen.
7. THE Validator SHALL store only a hashed representation of the PIN; the raw PIN SHALL NOT be stored in `localStorage` or `sessionStorage`.

---

### Requirement 2: Site Navigation Panel

**User Story:** As the Owner, I want a navigation panel that links to every public page so that I can quickly visit any part of the live site from the Dashboard.

#### Acceptance Criteria

1. THE Nav_Panel SHALL display one Page_Link for each of the seven public pages: index, about, education, movies, music, sports, and contact.
2. WHEN the Owner clicks a Page_Link, THE Dashboard SHALL open the target page in a new browser tab.
3. THE Nav_Panel SHALL display the page title and a recognizable icon or emoji for each Page_Link.
4. THE Nav_Panel SHALL remain visible and accessible from all sections of the Dashboard without requiring a page reload.

---

### Requirement 3: Overview and Analytics

**User Story:** As the Owner, I want an overview panel that shows site activity and key metrics so that I can understand how the website is being used.

#### Acceptance Criteria

1. THE Overview_Panel SHALL display an Analytics_Widget showing the total number of Content_Items currently in the Content_Store for each content section (movies, music, education courses, sports news).
2. THE Overview_Panel SHALL display an Analytics_Widget showing the count of contact form submissions stored in `localStorage`.
3. THE Overview_Panel SHALL display an Analytics_Widget showing the count of newsletter subscriptions stored in `localStorage`.
4. THE Overview_Panel SHALL display the Activity_Log listing the 20 most recent owner actions with a date-time stamp and a description of each action.
5. WHEN new data is added to `localStorage` by any module, THE Overview_Panel SHALL update its Analytics_Widgets without requiring a full page reload.
6. IF no Activity_Log entries exist, THEN THE Overview_Panel SHALL display the message "No activity recorded yet."
7. THE Overview_Panel SHALL display the current date and time, updated every 60 seconds.

---

### Requirement 4: Content Management — Movies

**User Story:** As the Owner, I want to add, edit, and remove movie cards on the Movies page so that I can keep the film catalog up to date.

#### Acceptance Criteria

1. THE Content_Editor SHALL display all existing movie Content_Items retrieved from the Content_Store.
2. WHEN the Owner submits the movie creation form with a title, genre tags, year, and star rating, THE Content_Editor SHALL add a new movie Content_Item to the Content_Store and append the corresponding card to `movies.html` at next page load.
3. WHEN the Owner submits the movie creation form with a missing required field (title, genre, or year), THE Content_Editor SHALL display a field-level validation error and SHALL NOT save the Content_Item.
4. WHEN the Owner clicks Edit on an existing movie Content_Item, THE Content_Editor SHALL populate the movie form with the item's current values.
5. WHEN the Owner saves edits to an existing movie Content_Item, THE Content_Editor SHALL update the item in the Content_Store.
6. WHEN the Owner clicks Delete on a movie Content_Item, THE Content_Editor SHALL prompt for confirmation before removing the item from the Content_Store.
7. WHEN a movie Content_Item is deleted and confirmed, THE Content_Editor SHALL record a deletion entry in the Activity_Log with a timestamp.

---

### Requirement 5: Content Management — Music

**User Story:** As the Owner, I want to add, edit, and remove music cards on the Music page so that I can keep the track listing current.

#### Acceptance Criteria

1. THE Content_Editor SHALL display all existing music Content_Items retrieved from the Content_Store.
2. WHEN the Owner submits the music creation form with a title, artist, genre tag, and badge label, THE Content_Editor SHALL add a new music Content_Item to the Content_Store.
3. WHEN the Owner submits the music creation form with a missing required field (title, artist, or genre), THE Content_Editor SHALL display a field-level validation error and SHALL NOT save the Content_Item.
4. WHEN the Owner edits and saves a music Content_Item, THE Content_Editor SHALL update the item in the Content_Store.
5. WHEN the Owner deletes a music Content_Item after confirming, THE Content_Editor SHALL remove the item from the Content_Store and record the action in the Activity_Log.

---

### Requirement 6: Content Management — Education

**User Story:** As the Owner, I want to add, edit, and remove course cards on the Education page so that I can update the learning resources offered.

#### Acceptance Criteria

1. THE Content_Editor SHALL display all existing education Content_Items retrieved from the Content_Store.
2. WHEN the Owner submits the course creation form with a title, level (Beginner / Intermediate / Advanced), category tag, description, and at least one topic list item, THE Content_Editor SHALL add a new education Content_Item to the Content_Store.
3. WHEN the Owner submits the course creation form with a missing required field, THE Content_Editor SHALL display a field-level validation error and SHALL NOT save the Content_Item.
4. WHEN the Owner edits and saves an education Content_Item, THE Content_Editor SHALL update the item in the Content_Store.
5. WHEN the Owner deletes an education Content_Item after confirming, THE Content_Editor SHALL remove the item from the Content_Store and record the action in the Activity_Log.

---

### Requirement 7: Content Management — Sports News

**User Story:** As the Owner, I want to add, edit, and remove sports news cards on the Sports page so that I can publish the latest sports content.

#### Acceptance Criteria

1. THE Content_Editor SHALL display all existing sports news Content_Items retrieved from the Content_Store.
2. WHEN the Owner submits the sports news creation form with a title, sport category, summary text, and time label, THE Content_Editor SHALL add a new sports news Content_Item to the Content_Store.
3. WHEN the Owner submits the sports news creation form with a missing required field, THE Content_Editor SHALL display a field-level validation error and SHALL NOT save the Content_Item.
4. WHEN the Owner edits and saves a sports news Content_Item, THE Content_Editor SHALL update the item in the Content_Store.
5. WHEN the Owner deletes a sports news Content_Item after confirming, THE Content_Editor SHALL remove the item from the Content_Store and record the action in the Activity_Log.

---

### Requirement 8: Content Management — Homepage Featured Section

**User Story:** As the Owner, I want to manage the "Featured This Week" cards on the homepage so that I can highlight current picks for visitors.

#### Acceptance Criteria

1. THE Content_Editor SHALL display the current featured Content_Items for the homepage retrieved from the Content_Store.
2. WHEN the Owner submits the featured content form with a tag label, title, description, link target, and background gradient, THE Content_Editor SHALL update the corresponding featured Content_Item in the Content_Store.
3. WHEN the Owner submits the featured content form with a missing required field, THE Content_Editor SHALL display a field-level validation error and SHALL NOT save the Content_Item.
4. THE Content_Editor SHALL allow the Owner to designate at most 3 active featured Content_Items at any time.
5. IF the Owner attempts to activate a fourth featured Content_Item while 3 are already active, THEN THE Content_Editor SHALL display an error message and SHALL NOT save the fourth item as active.

---

### Requirement 9: Content Persistence and Page Integration

**User Story:** As the Owner, I want content I add or remove in the Dashboard to appear on the public pages so that visitors see the updated content.

#### Acceptance Criteria

1. WHEN a public page loads, THE page SHALL read its corresponding Content_Store keys from `localStorage` and render any Owner-added Content_Items alongside the default static cards.
2. WHEN a Content_Item is deleted via the Dashboard, THE corresponding public page SHALL not render that item on next load.
3. THE Content_Store SHALL use a consistent JSON schema so that each Content_Item contains at minimum: `id`, `type`, `title`, `createdAt`, and `updatedAt` fields.
4. FOR ALL Content_Items written to the Content_Store and then read back, THE page rendering logic SHALL produce a card visually consistent with the existing static cards on that page (round-trip consistency).
5. WHEN `localStorage` is unavailable (e.g., private browsing mode with storage blocked), THE Dashboard SHALL display a warning message and disable the content management features.

---

### Requirement 10: Dashboard Layout and Usability

**User Story:** As the Owner, I want a clear, well-organized dashboard layout so that I can efficiently find and use each feature without confusion.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a sidebar or top navigation with labeled sections for: Overview, Movies, Music, Education, Sports, Featured, and Navigation.
2. WHEN the Owner clicks a section in the Dashboard navigation, THE Dashboard SHALL display the corresponding panel without a full page reload.
3. THE Dashboard SHALL match the MAC Media visual identity: dark background (`#0f0f0f`), red accent (`#e50914`), and `Segoe UI` font family.
4. THE Dashboard SHALL be responsive and remain fully functional on screen widths of 768 px and above.
5. WHEN a form submission succeeds, THE Dashboard SHALL display a success notification that auto-dismisses after 3 seconds.
6. WHEN a form submission fails validation, THE Dashboard SHALL display inline error messages adjacent to each invalid field.
