import axios from 'axios';

// Function to call TranslateLanguage API
const translateLanguage = async (settingId, newValue, language) => {
    try {
        const response = await axios.post('/path-to-your-api/translate-language', {
            setting_id: settingId,
            newValue: newValue,
            language: language
        });
        return response.data;
    } catch (error) {
        console.error('Error occurred while translating:', error.response ? error.response.data : error.message);
        throw error;
    }
};
