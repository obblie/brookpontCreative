# CD Journal - Web-based Balance Sheet & P&L Tracker

A modern, interactive web application that replaces your Excel-based CD Journal for tracking monthly Balance Sheet and Profit & Loss statements with yearly accrual functionality.

## Features

### 📊 Balance Sheet Management
- **Current Assets**: Cash, Accounts Receivable, Inventory, Prepaid Expenses
- **Fixed Assets**: Property Plant & Equipment, Accumulated Depreciation, Intangible Assets
- **Current Liabilities**: Accounts Payable, Short-term Debt, Accrued Expenses
- **Long-term Liabilities**: Long-term Debt, Other Long-term Liabilities
- **Equity**: Owner's Equity, Retained Earnings
- **Real-time Balance Verification**: Automatic checking that Assets = Liabilities + Equity

### 💰 Profit & Loss Statement
- **Revenue Tracking**: Sales Revenue, Service Revenue, Other Revenue
- **Cost of Goods Sold**: Direct Materials, Direct Labor, Manufacturing Overhead
- **Operating Expenses**: Comprehensive expense categories including Salaries, Rent, Utilities, Marketing, etc.
- **Other Income/Expenses**: Interest Income/Expense, Other Income
- **Automatic Calculations**: Gross Profit, Operating Income, Net Income

### 📈 Year Summary & Analytics
- **Interactive Charts**: Monthly revenue, expense, and net income trends
- **Key Metrics Dashboard**: YTD totals, averages, and performance indicators
- **Monthly Summary Table**: Complete year overview with cumulative tracking
- **Visual Analytics**: Chart.js powered visualizations

### 🏦 General Ledger Integration
- **GL Account Management**: Create, edit, and organize chart of accounts
- **Account Mapping**: Assign specific GL account numbers to each financial entry
- **Standard Account Structure**: Assets (1000-1999), Liabilities (2000-2999), Equity (3000-3999), Revenue (4000-4999), Expenses (5000-9999)
- **Search & Filter**: Quickly find GL accounts by number or name
- **Data Integrity**: Maintains GL account associations with financial data

### 💾 Data Management
- **Local Storage**: Automatic saving of all entries with GL account information
- **Import/Export**: JSON-based data backup and restore including GL accounts
- **Multi-Year Support**: Track multiple years of financial data
- **Month Navigation**: Easy navigation between months and years

## Getting Started

### Installation
1. Download all files to a folder on your computer
2. Open `index.html` in any modern web browser
3. Start entering your financial data!

### Basic Usage

#### 1. Balance Sheet Entry
- Navigate to the "Balance Sheet" tab
- Use the month navigation arrows to select your desired month
- Enter values for each account category
- The system automatically calculates totals and verifies the balance
- Green indicator shows when Assets = Liabilities + Equity

#### 2. Profit & Loss Entry
- Switch to the "Profit & Loss" tab
- Select the same month as your balance sheet
- Enter revenue and expense data
- View real-time calculations of Gross Profit, Operating Income, and Net Income

#### 3. GL Account Setup
- Go to the "GL Accounts" tab to:
  - View pre-configured chart of accounts
  - Add new GL accounts with proper numbering
  - Edit existing account names and descriptions
  - Search and filter accounts
- Return to Balance Sheet/P&L tabs to assign GL accounts to each entry

#### 4. Year Summary
- Visit the "Year Summary" tab to see:
  - Interactive charts showing monthly trends
  - Key performance metrics
  - Complete monthly summary table
  - Year-to-date totals

### Data Persistence
- All data is automatically saved to your browser's local storage
- Data persists between sessions
- Use Export/Import features for backup and data transfer

## File Structure

```
cdJournal/
├── index.html          # Main application page
├── styles.css          # Complete styling and responsive design
├── script.js           # Application logic and calculations
├── README.md           # This documentation
└── cdJournalTemplate.xlsm  # Original Excel template (reference)
```

## Technical Features

### Responsive Design
- Mobile-friendly interface
- Tablet and desktop optimized
- Touch-friendly navigation

### Modern UI/UX
- Clean, professional design
- Intuitive navigation
- Real-time feedback
- Color-coded indicators

### Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely in the browser
- Uses modern JavaScript features with graceful fallbacks

## Data Export/Import

### Exporting Data
1. Click the "Export Data" button in the header
2. A JSON file will be downloaded with all your financial data
3. File includes timestamp and version information
4. Use this for backups or transferring data between devices

### Importing Data
1. Click the "Import Data" button
2. Select a previously exported JSON file
3. Data will be loaded and replace current data
4. Refresh the page to see imported data

## General Ledger Account Management

### GL Account Structure
The application uses a standard chart of accounts structure:
- **Assets**: 1000-1999 (Current Assets: 1000-1399, Fixed Assets: 1400-1999)
- **Liabilities**: 2000-2999 (Current: 2000-2199, Long-term: 2200-2999)
- **Equity**: 3000-3999
- **Revenue**: 4000-4999
- **Expenses**: 5000-9999

### Adding New GL Accounts
1. Navigate to the "GL Accounts" tab
2. Click "Add Account" button
3. Enter 4-digit account number (must be within proper range)
4. Provide account name and description
5. Select account type from dropdown
6. Save to add to your chart of accounts

### Editing GL Accounts
- Click the edit button (pencil icon) next to any account
- Modify name, description, or type as needed
- Account numbers cannot be changed once created

### Assigning GL Accounts to Entries
- When entering financial data, select the appropriate GL account from the dropdown
- Each entry can be mapped to a specific GL account number
- GL account information is saved with each transaction

### Pre-configured Accounts
The system comes with common GL accounts pre-configured:
- 1010: Cash - Operating
- 1200: Accounts Receivable
- 1300: Inventory
- 2010: Accounts Payable
- 4010: Sales Revenue
- 6010: Salaries & Wages
- And many more...

## Account Categories

### Balance Sheet Accounts
**Assets:**
- Cash & Cash Equivalents
- Accounts Receivable
- Inventory
- Prepaid Expenses
- Property, Plant & Equipment
- Accumulated Depreciation
- Intangible Assets

**Liabilities:**
- Accounts Payable
- Short-term Debt
- Accrued Expenses
- Long-term Debt
- Other Long-term Liabilities

**Equity:**
- Owner's Equity
- Retained Earnings

### P&L Accounts
**Revenue:**
- Sales Revenue
- Service Revenue
- Other Revenue

**Cost of Goods Sold:**
- Direct Materials
- Direct Labor
- Manufacturing Overhead

**Operating Expenses:**
- Salaries & Wages
- Rent
- Utilities
- Marketing & Advertising
- Insurance
- Professional Services
- Depreciation
- Other Operating Expenses

**Other:**
- Interest Income
- Interest Expense
- Other Income

## Tips for Best Use

1. **Monthly Consistency**: Enter data for the same month in both Balance Sheet and P&L tabs
2. **Regular Backups**: Export your data monthly for backup purposes
3. **Balance Verification**: Always ensure your Balance Sheet balances before moving to the next month
4. **Year Planning**: Use the Summary tab to analyze trends and plan for future months
5. **Multi-Year Tracking**: Change the year selector to track multiple years of data

## Troubleshooting

### Data Not Saving
- Ensure your browser allows local storage
- Check that you're not in private/incognito mode
- Clear browser cache if experiencing issues

### Charts Not Loading
- Ensure you have an internet connection (Chart.js loads from CDN)
- Refresh the page if charts appear blank
- Check browser console for any error messages

### Balance Sheet Not Balancing
- Double-check all entered values for accuracy
- Ensure depreciation is entered as a positive number (system handles the subtraction)
- Review all account categories for missing entries

## Support

This application is designed to be self-contained and user-friendly. For additional support:

1. Check the browser console for any error messages
2. Ensure all files are in the same directory
3. Use a modern, updated web browser
4. Verify JavaScript is enabled in your browser

## Version History

**Version 1.0** - Initial Release
- Complete Balance Sheet functionality
- Full P&L statement tracking
- Year summary with charts
- Import/Export capabilities
- Mobile-responsive design
- Local storage persistence

---

*Created as a modern web replacement for Excel-based CD Journal tracking*
