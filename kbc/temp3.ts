import { rem } from '../../../../style/styleFunctions';
import { RequirementDetailType } from '../../../../types';
import { createNumberInput } from '../../../../utils/whatever';
import { DetailSectionTable, DetailSectionTableLeft, DetailTab } from './RequirementDetailPanel';

interface SiteReqsProps {
  editMode: boolean;
  reqDetails: RequirementDetailType;
  handleInputChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  handleNumberInputChange: React.ChangeEventHandler<HTMLInputElement>;
}

const SiteReqsTab = ({
  editMode,
  reqDetails,
  handleInputChange,
  handleNumberInputChange
}: SiteReqsProps) => {
  console.log('client reqs tab open');
  return (
    <DetailTab className="site-contents">
      <DetailSectionTableLeft className="left-table">
        <tbody>
          <tr>
            <th>LAND ACRES MIN</th>
            <td>
              {editMode ?
                createNumberInput(
                  'land_acre_min',
                  handleNumberInputChange,
                  reqDetails.land_acre_min
                ) : reqDetails.land_acre_min}
            </td>
          </tr>
          <tr>
            <th>LAND ACRES MAX</th>
            <td>
              {editMode ?
                createNumberInput(
                  'land_acre_max',
                  handleNumberInputChange,
                  reqDetails.land_acre_max
                ) : reqDetails.land_acre_max}
            </td>
          </tr>
          <tr style={{ height: 15 }} />
          <tr>
            <th>LAND SQ FT MIN</th>
            <td>
              {editMode ?
                createNumberInput(
                  'property_sqft_min',
                  handleNumberInputChange,
                  reqDetails.property_sqft_min
                ) : reqDetails.property_sqft_min}
            </td>
          </tr>
          <tr>
            <th>LAND SQ FT MAX</th>
            <td>
              {editMode ?
                createNumberInput(
                  'property_sqft_max',
                  handleNumberInputChange,
                  reqDetails.property_sqft_max
                ) : reqDetails.property_sqft_max}
            </td>
          </tr>
          <tr style={{ height: 15 }} />
          <tr>
            <th>OFFICE SF MIN</th>
            <td>
              {editMode ?
                createNumberInput(
                  'office_sqft_min',
                  handleNumberInputChange,
                  reqDetails.office_sqft_min
                ) : reqDetails.office_sqft_min}
            </td>
          </tr>
          <tr>
            <th>OFFICE SF MAX</th>
            <td>
              {editMode ?
                createNumberInput(
                  'office_sqft_max',
                  handleNumberInputChange,
                  reqDetails.office_sqft_max
                ) : reqDetails.office_sqft_max}
            </td>
          </tr>
        </tbody>
      </DetailSectionTableLeft>
      <DetailSectionTable className="right-table">
        <tbody>
          <tr>
            <th>MIN DOCK DOORS</th>
            <td>
              {editMode ?
                createNumberInput(
                  'dock_door_min',
                  handleNumberInputChange,
                  reqDetails.dock_door_min
                ) : reqDetails.dock_door_min}
            </td>
          </tr>
          <tr>
            <th>MIN GRADE DOORS</th>
            <td>n/a</td>
          </tr>
          <tr>
            <th>CLEAR HEIGHT FT MIN</th>
            <td>
              {editMode ?
                createNumberInput(
                  'clear_height_min',
                  handleNumberInputChange,
                  reqDetails.clear_height_min
                ) : reqDetails.clear_height_min}
            </td>
          </tr>
          <tr>
            <th>SITE COMMENTS</th>
            {reqDetails.site_comment ? <td /> : <td>NONE</td>}
          </tr>
          {reqDetails.site_comment || editMode ? (
            <tr style={{ position: 'relative', height: '40%' }}>
              {editMode ? (
                <td>
                  <textarea
                    name="site_comment"
                    onChange={handleInputChange}
                    value={reqDetails.site_comment || ''}
                  />
                </td>
              ) : (
                <td
                  style={{
                    height: rem(64),
                    position: 'absolute',
                    padding: '0 10 0 20',
                    overflowY: 'scroll'
                  }}
                >{reqDetails.site_comment}
                </td>
              )}
            </tr>
          ) : <td />}
        </tbody>
      </DetailSectionTable>
    </DetailTab>
  );
};

export default SiteReqsTab;

const SiteCommentsContainer = styled.tr`
  height: 38%;
  position: absolute;
  top: 58%;
  padding: ${rem(10)};
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 6px !important; /* width of the entire scrollbar */
  }
  
  ::-webkit-scrollbar-track {
    background: transparent; 
    /* color of the tracking area - this one is different from others! */
  }
  
  ::-webkit-scrollbar-thumb {
    background-color: ${colors.grey}; /* color of the scroll thumb */
    border-radius: 20px; /* roundness of the scroll thumb */
  }
`;
