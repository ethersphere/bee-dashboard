# File Manager Module Documentation

## Introduction

The File Manager module is a decentralized file storage interface built on top of Ethereum Swarm. It provides a complete file management system that leverages Swarm's postage stamp mechanism for incentivized storage and retrieval.

### Table of Contents

- [Introduction](#introduction)
- [Key Concepts](#key-concepts)
- [Architecture Overview](#architecture-overview)
- [Module Structure](#module-structure)
- [Getting Started](#getting-started)
- [State Management](#state-management)
- [Core Features](#core-features)
- [Operation Flows](#operation-flows)
- [Component Architecture](#component-architecture)
- [Design Patterns](#design-patterns)
- [Troubleshooting](#troubleshooting)
- [Testing Approach](#testing-approach)
- [Performance Considerations](#performance-considerations)
- [Known Limitations](#known-limitations)
- [Future Enhancements](#future-enhancements)

### What is File Manager?

File Manager allows users to:
- Create and manage multiple isolated storage containers (drives)
- Upload, download, and organize files with folder support
- Configure security levels (redundancy levels) using erasure coding
- Purchase and manage postage stamp batches to pay for storage
- Track file versions and restore previous states
- Handle file conflicts and perform bulk operations

### Core Philosophy

File Manager is built around several key principles:

1. **Decentralization**: All file metadata and content are stored on Swarm, not centralized servers
2. **User Control**: Users own their private keys and control their data
3. **Stamp-Based Storage**: All operations require valid postage stamps (blockchain-backed storage payment)
4. **Complexity Management**: Components follow strict complexity limits (max 20) with extraction patterns
5. **State Consistency**: Real-time synchronization between UI and Swarm storage

---

## Key Concepts

### Drives

**Drives** are isolated storage containers that hold files and folders. Each drive:
- Has a unique ID derived from its creation topic on Swarm
- Is associated with a specific postage batch
- Has configurable initial capacity and desired lifetime (inherited from batch)
- Can be either an **admin drive** (manages system state) or **user drive** (stores user files)
- Maintains its own file list and metadata

**Admin Drive** is a special drive that:
- Is created once per File Manager instance
- Stores the list of all user drives
- Must be initialized before any other operations
- Uses a stamp labeled `ADMIN_STAMP_LABEL`
- Cannot be deleted (only reset)

**User Drives** are regular drives that:
- Store user files and folders
- Can be created, upgraded, or destroyed
- Appear in the sidebar for navigation
- Move to "Expired Drives" when their postage batch expires

### Postage Stamps

**Postage Stamps** (or batches) are blockchain-based payment mechanisms for Swarm storage:
- Purchased with BZZ tokens (Swarm's native token)
- Have a **batchID** (unique identifier)
- Define **initial capacity** (storage space) and **desired lifetime** (time-to-live)
- Must be **usable** (not expired, not diluted beyond capacity)
- Can have optional labels for identification

**Postage Batch Validation** is critical:
- Before creating drives
- Before uploading files
- During admin drive initialization
- Invalid or unusable batches cause operations to fail

### File Info

**FileInfo** objects represent files in File Manager:
- Stored as metadata on Swarm (not in local storage)
- Contains: name, size, mime type, timestamps, drive association
- Has a **topic** (unique identifier derived from path and parent)
- Can be **trashed** (soft delete) or **forgotten** (hard delete)
- Supports versioning via **history** (Swarm feed entries)

### Erasure Coding

**Erasure coding** provides data redundancy:
- **OFF**: No redundancy (1x storage)
- **MEDIUM**: Moderate redundancy (~2x storage)
- **STRONG**: High redundancy (~3x storage)
- **INSANE**: Very high redundancy (~4x storage)
- **PARANOID**: Maximum redundancy (~5x storage)

Higher levels cost more but protect against data loss if Swarm nodes go offline.

---

## Architecture Overview

### High-Level Flow

The File Manager follows a layered architecture:

1. **User Action** - User interacts with UI components
2. **Component Layer** - FileBrowser, DriveItem, Modals handle UI logic
3. **Context Layer** - FileManagerProvider, ViewProvider, SearchProvider manage state
4. **Library Layer** - FileManagerBase from @solarpunkltd/file-manager-lib handles business logic
5. **API Layer** - Bee API from @ethersphere/bee-js communicates with Swarm
6. **Network Layer** - Swarm network stores data

### State Management

File Manager uses **React Context** for state management with three separate contexts:

1. **FileManagerProvider** - Core FM state: drives, files, admin drive, current drive. Manages FM instance lifecycle and event listeners.

2. **ViewProvider** - UI view preferences (grid/list) and current item being viewed (drive name or search results).

3. **SearchProvider** - Search query and scope (all drives, selected drive), filter options (include active, include trashed).

This separation ensures that updates in one context don't unnecessarily trigger re-renders in components that only depend on other contexts.

### Component Hierarchy

The component structure follows a strict hierarchy:
- **FileManagerPage** - Orchestrates initialization flow
- **Providers** - Wrap entire tree (FileManager → View → Search)
- **Header** - Top navigation
- **AdminStatusBar** - Admin stamp status display
- **Sidebar** - Drive list with create/destroy actions
- **FileBrowser** - Main file browser with operations
- **Modals** - Various modals for different operations

---

## Module Structure

### Directory Organization

The File Manager module is organized into logical sections:

**Components Directory** - All React UI components, each in its own folder with associated styles and tests. Major components include FileBrowser (main interface), Sidebar (drive navigation), various modals for operations, and reusable elements like buttons and dropdowns.

**Hooks Directory** - Custom React hooks for specific functionality. Key hooks include useTransfers (upload/download management), useFileFiltering (search and filtering), useBulkActions (bulk operations), and useSorting (column sorting).

**Utils Directory** - Pure utility functions. Includes Bee API wrappers for stamp validation and drive operations, common helpers for formatting, download logic, and UI utilities.

**Constants Directory** - Configuration constants for erasure code levels, postage batch desired lifetimes, tooltips, and transfer statuses.

---

## Getting Started

### Prerequisites

1. **Bee Node**: Running Bee node (dev mode or mainnet). Can be local or remote connection via Settings.

2. **Wallet Balance**: BZZ tokens to purchase postage batches, and xDAI for gas fees on blockchain transactions.

3. **CORS Configuration**: Bee node must allow CORS from the dashboard origin.

### Initial Setup Flow

**First Launch - Private Key Generation**

When a user first visits File Manager, they must provide or generate a private key. This key is stored in browser local storage and is critical - loss of the key means permanent data loss with no recovery option.

**One-Time Admin Drive Creation**

After the private key is set, the system checks for an admin drive. If none exists, the InitialModal appears automatically. The user selects initial capacity and desired lifetime, then purchases a postage batch with BZZ tokens. The system creates the admin drive which stores all user drive metadata.

**Creating User Drives**

Once the admin drive exists, users can create user drives from the sidebar. They enter a drive name (max 40 characters), select initial capacity, desired lifetime, and security level (erasure coding). The system displays the BZZ cost and creates the drive upon confirmation.

**Uploading Files**

Users select a drive from the sidebar, then drag-and-drop files or click "Upload File(s)". They choose an active postage batch, and the system monitors progress with ETA calculations. Files are uploaded with automatic conflict resolution if names already exist.

---

## State Management

### FileManager Provider

The FileManager Provider is the core state management solution. It manages:

**Core State**: The FileManagerBase instance, all files across drives, user drives with valid postage batches, expired drives, admin drive, currently selected drive, and currently selected postage batch.

**Error States**: Initialization errors, error modal visibility, and reset requirements when admin postage batch is invalid.

**Synchronization**: Real-time updates through event listeners that respond to drive and file changes from the FileManagerBase library.

### Initialization Sequence

The provider handles a complex initialization:

1. **Private Key Check** - Retrieves key from local storage. If missing, initialization halts until user provides one.

2. **Bee Instance Creation** - Creates Bee client with the private key as signer, then creates FileManagerBase instance.

3. **Event Listener Registration** - Registers handlers for all file manager events (drive created, file uploaded, file trashed, etc.).

4. **Admin Postage Batch Validation** - If admin postage batch exists, validates it's still usable. Invalid batches trigger reset flow.

5. **State Synchronization** - Categorizes drives into admin, user, and expired based on postage batch validity. Populates file list.

### Drive Categorization

The system continuously categorizes drives based on postage batch validity:

**Admin Drive** - Must have valid postage batch. If invalid, entire FM enters reset state.

**User Drives** - Drives with valid, usable postage batches appear in main drive list for normal operations.

**Expired Drives** - Drives whose postage batches expired but data still exists on Swarm. Appear in collapsed section, cannot be modified but can be viewed.

### State Synchronization Methods

**Sync Files** - Updates the files array when files are uploaded, trashed, restored, or forgotten. Can update entire list or individual files incrementally.

**Sync Drives** - Updates drive arrays (user, expired, admin) when drives are created, upgraded, or destroyed. Fetches current postage batch validity and recategorizes.

**Resync** - Full state refresh that re-initializes FM instance and restores previous selections if still valid. Used after major operations or manual refresh.

**Refresh Postage Batch** - Updates a specific postage batch's information without full resync. Used after uploads to update capacity.

### Event Flow

When a user performs an operation like uploading a file:

1. Component calls FM method
2. FileManagerBase library executes operation
3. Library emits event when complete
4. Provider's event listener catches it
5. Provider updates React state
6. UI automatically re-renders with new data

This event-driven architecture keeps UI and Swarm state perfectly synchronized.

---

## Core Features

### Upload Management

The upload system handles complex scenarios:

**Conflict Detection** - Before upload, checks if file name already exists in target drive. Offers three resolution options: Cancel (skip file), Keep Both (rename with suffix like "file (1).txt"), or Replace (overwrite with new version).

**Queue Processing** - Uploads are queued and processed with maximum 10 concurrent uploads. This prevents overwhelming the network while maintaining good throughput.

**Progress Tracking** - Each upload shows percentage complete, data transferred, elapsed time, and ETA. ETA uses smoothing algorithm to prevent wild fluctuations from network speed variations.

**Postage Batch Validation** - Before each upload, validates the selected postage batch is still usable. Verifies sufficient capacity remains for the file size considering erasure coding overhead.

**Cancellation** - Users can cancel in-progress uploads. The system uses abort controllers to cleanly terminate HTTP requests and update transfer status.

### Download Management

Downloads execute in the background using browser's native download API:

**Progress Tracking** - Similar to uploads, shows percentage, speed, and ETA for each download.

**Bulk Downloads** - Users can select multiple files and download all at once. Each download tracks independently.

**Background Execution** - Downloads continue even if user navigates away from File Manager (within same browser tab).

### File Filtering

The filtering system supports multiple criteria:

**Search Query** - Case-insensitive substring matching on file names.

**Drive Scope** - Filter to selected drive only, or search across all drives.

**Trash Status** - Include active files only, trashed files only, or both.

**State Preservation** - When entering search mode, current filter settings are saved. Clearing search restores previous settings automatically.

### Sorting

Users can sort file lists by multiple columns:

**Sort Keys** - Name (alphabetical), Size (bytes), Timestamp (upload date), Drive (name, when searching all drives).

**Sort Direction** - Ascending or descending. Clicking same column header toggles direction.

**Sort Reset** - Clear sorting returns to natural order (order from Swarm).

### Bulk Operations

Select multiple files and perform batch actions:

**Bulk Trash** - Move multiple files to trash (soft delete). Can be restored later.

**Bulk Restore** - Restore multiple trashed files to active status.

**Bulk Forget** - Permanently delete files (irreversible). Requires confirmation.

**Bulk Download** - Download multiple files simultaneously with individual progress tracking.

### Version History

Files support full version history:

**Version Tracking** - Each file upload creates new version, previous versions retained.

**View History** - Modal shows all versions with timestamps and sizes.

**Restore Version** - Roll back to any previous version, which becomes the new current version.

**Storage Impact** - Each version consumes postage batch capacity, old versions can be forgotten but space continues to be occupied.

### Drag and Drop

Full drag-and-drop support for file uploads:

**Visual Feedback** - Overlay appears when dragging files over browser area.

**Drag Counter** - Tracks nested drag events to prevent flickering on complex layouts.

**Drop Handling** - Processes dropped files through same upload pipeline as manual selection.

---

## Operation Flows

### Initial Setup

**User Opens /file-manager**
- System checks for private key in local storage
- If no key: Shows PrivateKeyModal for user to enter or generate key
- If has key: Initializes FileManager

**FileManager Initialization**
- Creates Bee instance with user's private key
- Creates FileManagerBase instance
- Registers event listeners for all FM events
- Reads admin state from Swarm

**Admin Drive Validation**
- If admin postage batch exists and valid: Loads drives and files, shows FileBrowser
- If admin postage batch exists but invalid: Sets reset flag, shows InitialModal in reset mode
- If no admin postage batch (first time): Shows InitialModal for first-time setup

**Creating Admin Drive**
- User selects desired lifetime and security level (erasure coding)
- System calculates cost in BZZ tokens
- User confirms and purchases postage batch (blockchain transaction)
- System creates admin drive with purchased postage batch
- Success: Shows Sidebar and FileBrowser

### Creating User Drive

**User Initiates Creation**
- Clicks "Create New Drive" button in Sidebar
- CreateDriveModal appears

**Drive Configuration**
- User enters drive name (validated: max 40 chars)
- Selects initial capacity from dropdown
- Selects desired lifetime from dropdown
- Chooses security level (erasure coding: OFF, MEDIUM, STRONG, INSANE, PARANOID)

**Cost Calculation**
- System fetches current BZZ cost based on capacity, desired lifetime, and redundancy level
- Displays total cost to user
- Validates user has sufficient BZZ balance
- If insufficient: Shows error, disables Create button
- If sufficient: Enables Create button

**Drive Creation**
- User clicks Create
- System shows creation progress indicator
- Purchases new postage batch (blockchain transaction, waits for confirmation)
- Creates drive metadata on Swarm
- FM emits DRIVE_CREATED event
- Provider categorizes drive (has usable postage batch)
- Drive appears in Sidebar
- Success: User can now select and use the drive

### Uploading Files

**File Selection**
- User drags files onto browser OR clicks "Upload file(s)" button
- System receives file list

**Conflict Resolution (per file)**
- Checks if file.name already exists in current drive
- If no conflict: Proceeds with original name
- If conflict: Shows UploadConflictModal with options:
  - Cancel: Skip this file
  - Keep Both: Rename to unique name (e.g., "file (1).txt")
  - Replace: Overwrite existing file, creating new version

**Queue Processing**
- All files added to upload queue with resolved names
- Queue processes maximum 10 files concurrently
- For each file in batch:
  - Validates postage batch still exists and is usable
  - Verifies sufficient drive space remains
  - Creates transfer tracking item (shows in UI)
  - Executes upload with progress callbacks to Swarm
  - Updates progress (percentage, ETA, elapsed time)
  - On completion: Marks transfer Done, refreshes postage batch capacity 
  - On error: Marks transfer Error, shows error message
- Next batch starts when previous completes

**Event Synchronization**
- FM library emits FILE_UPLOADED event
- Provider's sync method adds/updates file in state
- UI automatically updates to show new file

### Destroying Drive

**User Initiates Destruction**
- Clicks menu button on Drive Item in Sidebar
- Selects "Destroy Drive" from context menu
- DestroyDriveModal appears with confirmation prompt

**Confirmation**
- User reads warning about permanent deletion
- User clicks "Destroy" button

**Destruction Process**
- Modal closes
- Progress overlay appears (spinner with "Destroying drive..." text)
- Overlay is clickable to expand to full progress modal
- System executes drive destruction:
  - Deletes drive metadata from Swarm
  - FM emits DRIVE_DESTROYED event
  - Provider removes drive from drives array
  - Provider removes all files belonging to destroyed drive
- Progress overlay disappears
- Drive no longer appears in Sidebar
- If drive was selected: View switches to another drive or empty state

### Downloading Files

**User Initiates Download**
- User right-clicks file
- Selects "Download" from menu

**Download Tracking**
- System creates download transfer item in UI
- Transfer item shows: file name, size, progress percentage
- Download panel appears at bottom of screen

**Download Execution**
- System retrieves file from Swarm using file's topic
- Uses browser's native download API to save file
- Progress callbacks update UI in real-time:
  - Bytes downloaded / total bytes (from Swarm chunks)
  - Download speed
  - Estimated time remaining (ETA with smoothing)
  - Elapsed time

**Background Processing**
- Downloads execute in background
- User can continue browsing File Manager
- Multiple downloads can run simultaneously
- Each download tracks independently

**Completion**
- On success: Browser saves file to user's downloads folder
- Transfer item marked as "Done"
- User can dismiss completed downloads
- On error: Shows error message, allows retry

**Cancellation**
- User clicks cancel button on transfer item
- System aborts HTTP request using AbortController
- Transfer item marked as "Cancelled"
- Partial download discarded

### Search Operation

**Entering Search**
- User types in search box
- SearchContext captures query
- System saves current scope and filter settings
- Sets inSearch flag to true

**Filtering Execution**
- useFileFiltering hook processes files array:
  - Filters by trash status (active/trashed based on checkboxes)
  - Filters by drive scope (selected drive vs all drives)
  - Filters by search query (case-insensitive substring match on name)
- Returns filtered array

**Sorting Application**
- useSorting hook processes filtered array
- Applies current sort key and direction
- Returns sorted array

**Display**
- FileBrowserContent renders sorted list
- If searching all drives: Shows drive name column
- If no results: Shows "No files found" message

**Exiting Search**
- User clears search box (empty query)
- System restores saved scope and filter settings
- Sets inSearch flag to false
- View returns to previous state

---

## Component Architecture

### Hierarchical Structure

File Manager follows strict component hierarchy to manage complexity:

**Page Level** - FileManagerPage orchestrates the entire module, handling initialization states and conditional rendering.

**Provider Level** - Three nested contexts (FileManager → View → Search) wrap the component tree, each managing separate concerns.

**Layout Level** - Header, AdminStatusBar, Sidebar, and FileBrowser form the main layout structure.

**Feature Level** - Major features like FileBrowser contain sub-components for specific areas (TopBar, Header, Content, Modals, Overlays).

**Primitive Level** - Reusable elements like buttons, dropdowns, tooltips, progress bars used throughout.

### Component Responsibilities

Each component has a single, clear responsibility:

**FileManagerPage** - Orchestrates initialization flow and conditional rendering based on FM state.

**Sidebar** - Displays drive list, handles navigation, shows drive creation button.

**DriveItem** - Renders individual drive with capacity info, context menu, progress indicators.

**FileBrowser** - Main file browser interface, coordinates all file operations.

**FileBrowserModals** - Renders all modals (extracted for complexity management).

**FileBrowserOverlays** - Renders progress overlays (extracted for complexity management).

---

## Known Limitations

### Admin Drive Expiration

**Status**: Not fully handled (TODO in code).

**Current Behavior**: When admin drive postage batch expires, entire FM enters invalid state. User must reset and create new admin drive. Previous user drives remain accessible if their postage batches are valid.

**Desired Behavior**: System detects admin postage batch expiration before it happens, shows warning with "Extend Batch" button, seamlessly extends admin postage batch without requiring reset.

### Drive Name Length

**Limitation**: Drive names limited to 40 characters maximum.

**Reason**: Swarm feed entry size constraints limit metadata size.

**Workaround**: Use shorter, descriptive names. Consider abbreviations or codes for long project names.

### Postage Batch Selection in CreateDriveModal

**Status**: TODO comment in code.

**Current Behavior**: CreateDriveModal always purchases new postage batch for each drive.

**Desired Behavior**: Dropdown to select from existing usable postage batches (like InitialModal has), allowing users to reuse batches with remaining capacity.

**Impact**: Users must purchase separate postage batch for each drive, even if existing batches have sufficient capacity for multiple drives.

### Postage Batch Capacity Calculation

**Issue**: Capacity calculation depends on erasure coding level.

**Problem**: Frontend calculates approximate capacity based on redundancy multiplier. Actual capacity depends on how Bee node distributes chunks across Swarm network.

**Current**: Approximate calculation usually close enough for practical use.

**Ideal**: Bee node provides exact remaining capacity calculation accounting for actual chunk distribution and erasure coding overhead.

### Ultra-Light Nodes

**Limitation**: Ultra-light Bee nodes cannot create drives or purchase postage batches.

**Requirement**: Users must upgrade to light node to use File Manager.

**Error Message**: Displayed in InitialModal and CreateDriveModal when ultra-light node detected.

**Documentation**: https://docs.ethswarm.org/docs/desktop/configuration/#upgrading-from-an-ultra-light-to-a-light-node

---


*This documentation provides a comprehensive functional overview of the File Manager module. For implementation details, refer to the source code in `src/modules/filemanager/` and `src/providers/FileManager.tsx`.*
