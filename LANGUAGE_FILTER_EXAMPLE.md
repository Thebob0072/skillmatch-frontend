# 🗣️ Language Filter Implementation Guide

## API Endpoint

```bash
GET /browse/search?languages=th,en,zh
```

## Query Parameters

- `languages` - Comma-separated language codes (e.g., "th,en,zh")
- Filters providers who speak **ANY** of the specified languages

## Supported Language Codes

```typescript
const supportedLanguages = {
  th: 'Thai (ไทย)',
  en: 'English',
  zh: 'Chinese (中文)',
  ja: 'Japanese (日本語)',
  ko: 'Korean (한국어)',
  fr: 'French (Français)',
  de: 'German (Deutsch)',
  es: 'Spanish (Español)',
  ru: 'Russian (Русский)',
  ar: 'Arabic (العربية)'
};
```

## React Component Example

### 1. Add Language Filter State

```typescript
// Add to BrowsePage.tsx
const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
```

### 2. Update API Call

```typescript
const loadProviders = async () => {
  try {
    setLoading(true);
    const params = new URLSearchParams();
    
    if (searchTerm) params.append('search', searchTerm);
    if (selectedProvince) params.append('province', selectedProvince);
    if (minRating > 0) params.append('rating', minRating.toString());
    if (selectedTier) params.append('tier', selectedTier.toString());
    if (selectedCategory) params.append('category', selectedCategory.toString());
    if (selectedLanguages.length > 0) {
      params.append('languages', selectedLanguages.join(',')); // ✅ Add this
    }
    params.append('sort', sortBy);
    
    const response = await fetch(`http://localhost:8080/browse/search?${params}`);
    const data = await response.json();
    
    setProviders(data.providers || []);
    setTotalResults(data.pagination?.total || 0);
  } catch (error) {
    console.error('Failed to load providers:', error);
  } finally {
    setLoading(false);
  }
};
```

### 3. Language Filter UI Component

```tsx
// Add to translation files first
// th: "ภาษาที่สื่อสารได้", "เลือกภาษา"
// en: "Spoken Languages", "Select Languages"
// zh: "使用语言", "选择语言"

// Add this in the filters section
<div>
  <label className="block text-sm font-bold text-gray-300 mb-2">
    🗣️ {t('browse.filters.languages')}
  </label>
  <div className="space-y-2">
    {[
      { code: 'th', label: 'ไทย', flag: '🇹🇭' },
      { code: 'en', label: 'English', flag: '🇬🇧' },
      { code: 'zh', label: '中文', flag: '🇨🇳' },
      { code: 'ja', label: '日本語', flag: '🇯🇵' },
      { code: 'ko', label: '한국어', flag: '🇰🇷' }
    ].map(({ code, label, flag }) => (
      <label
        key={code}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <input
          type="checkbox"
          checked={selectedLanguages.includes(code)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedLanguages([...selectedLanguages, code]);
            } else {
              setSelectedLanguages(selectedLanguages.filter(l => l !== code));
            }
          }}
          className="w-4 h-4 rounded border-2 border-neon-purple/50 bg-black/50 text-neon-purple focus:ring-neon-purple"
        />
        <span className="text-white group-hover:text-neon-pink transition-colors">
          {flag} {label}
        </span>
      </label>
    ))}
  </div>
</div>
```

### 4. Display Languages in Provider Card

```tsx
// Add this to ProviderCard component
{provider.languages && provider.languages.length > 0 && (
  <div className="flex flex-wrap gap-1 mt-2">
    {provider.languages.map(lang => {
      const languageMap = {
        th: { label: 'ไทย', flag: '🇹🇭' },
        en: { label: 'EN', flag: '🇬🇧' },
        zh: { label: '中文', flag: '🇨🇳' },
        ja: { label: '日本語', flag: '🇯🇵' },
        ko: { label: '한국어', flag: '🇰🇷' }
      };
      const langInfo = languageMap[lang as keyof typeof languageMap];
      
      return (
        <span
          key={lang}
          className="text-xs bg-neon-purple/20 border border-neon-purple/30 text-neon-purple px-2 py-1 rounded-full"
        >
          {langInfo?.flag} {langInfo?.label || lang}
        </span>
      );
    })}
  </div>
)}
```

### 5. Update Clear Filters Function

```typescript
const clearFilters = () => {
  setSearchTerm('');
  setSelectedCategory(null);
  setSelectedProvince('');
  setMinRating(0);
  setSelectedTier(null);
  setSortBy('rating');
  setSelectedLanguages([]); // ✅ Add this
};
```

## Translation Keys to Add

### Thai (th)
```json
{
  "browse": {
    "filters": {
      "languages": "ภาษาที่สื่อสารได้",
      "select_languages": "เลือกภาษา",
      "all_languages": "ทุกภาษา"
    }
  }
}
```

### English (en)
```json
{
  "browse": {
    "filters": {
      "languages": "Spoken Languages",
      "select_languages": "Select Languages",
      "all_languages": "All Languages"
    }
  }
}
```

### Chinese (zh)
```json
{
  "browse": {
    "filters": {
      "languages": "使用语言",
      "select_languages": "选择语言",
      "all_languages": "所有语言"
    }
  }
}
```

## API Response Example

```json
{
  "providers": [
    {
      "user_id": 123,
      "username": "sophia_bangkok",
      "languages": ["th", "en", "zh"],
      "rating_avg": 4.8,
      "review_count": 120,
      "...": "..."
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "total_pages": 3
  },
  "filters_applied": {
    "languages": "th,en,zh"
  }
}
```

## Testing Commands

### Single Language
```bash
curl "http://localhost:8080/browse/search?languages=th"
```

### Multiple Languages (OR logic - finds providers who speak ANY of these)
```bash
curl "http://localhost:8080/browse/search?languages=th,en,zh"
```

### Combined with Other Filters
```bash
curl "http://localhost:8080/browse/search?location=Bangkok&languages=en,zh&rating=4&tier=3"
```

## Use Cases

1. **Tourist Filter** - Find companions who speak tourist's language
   ```
   ?languages=en,zh,ja,ko
   ```

2. **Thai Speakers Only**
   ```
   ?languages=th
   ```

3. **Multilingual Companions**
   ```
   ?languages=th,en,zh
   ```

4. **High-End International Service**
   ```
   ?languages=en,fr,de&tier=4&rating=4.5
   ```

## Backend Note

The backend stores provider languages in the `languages` field as a PostgreSQL array of language codes:

```sql
-- Database schema
languages TEXT[] -- e.g., '{th,en,zh}'
```

The search query uses PostgreSQL array overlap operator:
```sql
WHERE (languages && ARRAY['th', 'en', 'zh']) -- Finds ANY match
```

## Benefits

✅ Tourists can find companions who speak their language  
✅ Reduces communication barriers  
✅ Improves user experience  
✅ Increases booking confidence  
✅ Better match quality

---

**Note:** To start the backend server, run:
```bash
cd /path/to/backend
go run main.go
```

Then test with:
```bash
curl "http://localhost:8080/browse/search?languages=th,en,zh" | jq
```
