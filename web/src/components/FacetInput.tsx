import React, { ReactElement } from 'react'
import styled from 'styled-components'

const FilterFacet = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const StyledInput = styled.input`
  font-size: 14px;
  margin-left: -1px;
  border-radius: 0.25rem;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  background-clip: padding-box;
  border: 1px solid ${props => props.theme.colors.textDisabledColor};
  padding: 0.5rem 0.75rem;
`

const FilterIcon = styled.span`
  display: flex;
  background-color: ${props => props.theme.colors.themeColor};
  border: 1px solid ${props => props.theme.colors.textDisabledColor};
  border-radius: 0.25rem;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  padding: 0.25rem;
`

type FacetInputProps = {
  value: string
  icon: string
  altTag?: string
  name: string
  placeholder?: string
  updateSearchFilter: (key: string, value: string) => void
  type: string
}

const FacetInput: React.FC<FacetInputProps> = ({
  value,
  icon,
  altTag,
  updateSearchFilter,
  name,
  placeholder,
  type,
}: FacetInputProps): ReactElement => (
  <FilterFacet>
    <FilterIcon>
      <img alt={altTag} src={icon} />
    </FilterIcon>
    <StyledInput
      min='1'
      name={name}
      value={value}
      placeholder={placeholder}
      type={type}
      onChange={evt => updateSearchFilter(evt.target.name, evt.target.value)}
    />
  </FilterFacet>
)

export default FacetInput
