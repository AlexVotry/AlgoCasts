// market-survey.entity.ts

import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Property } from 'src/properties/entities/property.entity';
import { BaseEntity } from '../../utils/base-entity/base.entity';
// import { MarketSurveyProperty } from './market-survey-property.entity';

@Entity('market_survey')
export class MarketSurvey extends BaseEntity {
  @Column({ type: 'int2', name: 'approved_head_count' })
  approvedHeadCount: number;

  @Column({ type: 'timestamp', name: 'projected_launch_year' })
  projectedLaunchYear: Date;

  @ManyToMany(() => Property)
  @JoinTable({
    name: 'market_survey_property_requirement',
    joinColumn: {
      name: 'market_survey_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'property_id',
      referencedColumnName: 'id',
    },
  })
  properties: Property[];
  // @OneToMany(
  //   () => MarketSurveyProperty,
  //   (marketSurveyProperty) => marketSurveyProperty.marketSurvey
  // )
  // marketSurveyProperties: MarketSurveyProperty[];
}
