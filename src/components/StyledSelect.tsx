import ReactSelect, {
    type Props as RSProps,
    type StylesConfig,
    type Theme,
    type GroupBase
  } from 'react-select';

function getDarkStyles<T>(): StylesConfig<T, true, GroupBase<T>> {
    return {
      control: base => ({ 
        ...base, 
        background: '#1F2937', 
        borderColor: '#374151', 
        '&:hover': { borderColor: '#10A37F' }, 
        boxShadow: 'none' 
      }),
      menu: base => ({ ...base, background: '#1F2937' }),
      option: (base, state) => ({ 
        ...base, 
        background: state.isFocused ? '#374151' : '#1F2937' 
      }),
      placeholder: base => ({ ...base, color: '#9CA3AF' }),
      multiValue: base => ({ ...base, background: '#10A37F' }),
      multiValueLabel: base => ({ ...base, color: '#FFF' }),
      multiValueRemove: base => ({ 
        ...base, 
        color: '#FFF',
        ':hover': { backgroundColor: '#EF4444', color: '#FFF' }
      }),
    };
  }
  
const darkTheme = (theme: Theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary:   '#10A37F', 
      primary25: '#166c41',
      neutral0:  '#1F2937',
      neutral5:  '#374151',
      neutral20: '#374151',
      neutral30: '#4B5563',
      neutral80: '#D1D5DB',
    }
  });
  
export default function StyledSelect<T = unknown>(
    props: RSProps<T, true>
) {
    return (
      <ReactSelect<T, true>
        {...props}
        isMulti
        styles={getDarkStyles<T>()}
        theme={darkTheme}
        className="text-gray-200"
      />
    );
}
  