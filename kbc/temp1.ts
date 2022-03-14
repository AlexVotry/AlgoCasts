// market-survey.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScoutLogger } from '../../utils/logger/scout.logger';
import { Repository } from 'typeorm';
import { MarketSurveyDto } from '../dto/market-survey.dto';
import { MarketSurvey } from '../entities/market-survey.entity';
import { MarketSurveyProperty } from '../entities/market-survey-property.entity';
import { MktSurveyPropertyDto } from '../dto/market-survey-property.dto';
import { SelectionType, SiteAction } from '../entities/market-survey.enums';
import { PropertyDto } from 'src/properties/dto/property.dto';
import { Property } from 'src/properties/entities/property.entity';

@Injectable()
export class MarketSurveysService {
  private logger = new ScoutLogger(MarketSurveysService.name);

  constructor(
    @InjectRepository(MarketSurvey)
    private readonly marketSurveyRepository: Repository<MarketSurvey>
  ) {}

  // create(createMarketSurveyDto: CreateMarketSurveyDto) {
  //   return 'This action adds a new marketSurvey';
  // }

  async findAll(): Promise<MarketSurveyDto[]> {
    const marketSurveys: MarketSurvey[] =
      await this.marketSurveyRepository.find();
    this.logger.debug(`retrieved ${marketSurveys.length} market surveys`);

    const marketSurveyDtoArray = marketSurveys.map(
      (marketSurvey: MarketSurvey) => {
        return this.convertMktSvyEntityToMktSvyDto(marketSurvey);
      }
    );
    return marketSurveyDtoArray;
  }

  // ? -> above is using Promise, below is using Observable - discuss???

  async findOne(id: string): Promise<MarketSurveyDto> {
    const bracketed = `{${id}}`;
    const data = await this.marketSurveyRepository.findOne(bracketed);
    console.log('findOne', data);
    return this.convertMktSvyEntityToMktSvyDto(data);
  }

  async findMarketSurveyProperties(id: string): Promise<Property[]> {
    const bracketed = `{${id}}`;
    const data = await this.marketSurveyRepository
      .createQueryBuilder('marketSurvey')
      .where({ id: bracketed })
      .leftJoinAndSelect('marketSurvey.properties', 'property')
      .getOne();
    console.log('market properties', data.properties);
    return data.properties;
  }

  // update(id: number, updateMarketSurveyDto: UpdateMarketSurveyDto) {
  //   return `This action updates a #${id} marketSurvey`;
  // }

  // delete(id: number) {
  //   return `This action removes a #${id} marketSurvey`;
  // }

  // ------------------- PRIVATE HELPER METHODS ------------------- //
  private convertMktSvyEntityToMktSvyDto(marketSurvey: MarketSurvey) {
    const marketSurveyDto: MarketSurveyDto = {
      id: marketSurvey.id,
      approvedHeadCount: marketSurvey.approvedHeadCount,
      projectedLaunchYear: marketSurvey.projectedLaunchYear,
      properties: marketSurvey.properties,
    };
    return marketSurveyDto;
  }

  private convertMktSvyPptyEntityToMktSvyDto(
    marketSurveyProperty: MarketSurveyProperty
  ) {
    const mktSurveyPropertyDto: MktSurveyPropertyDto = {
      id: marketSurveyProperty.id,
      siteAction: SiteAction[marketSurveyProperty.siteAction], // ENUM
      selectionType: SelectionType[marketSurveyProperty.selectionType], // ENUM
    };
    return mktSurveyPropertyDto;
  }
}
