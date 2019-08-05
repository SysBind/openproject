// -- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2015 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See doc/COPYRIGHT.rdoc for more details.
// ++

import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Injector} from '@angular/core';
import {AbstractWidgetComponent} from "app/modules/grids/widgets/abstract-widget.component";
import {I18nService} from "core-app/modules/common/i18n/i18n.service";
import {ProjectDmService} from "core-app/modules/hal/dm-services/project-dm.service";
import {CurrentProjectService} from "core-components/projects/current-project.service";
import {HalLink} from "core-app/modules/hal/hal-link/hal-link";

@Component({
  templateUrl: './project-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetProjectDetailsComponent extends AbstractWidgetComponent implements OnInit {
  public customFieldsMap:{ [key:string]:{title:string, value:string}} = {};

  constructor(protected readonly i18n:I18nService,
              protected readonly injector:Injector,
              protected readonly projectDm:ProjectDmService,
              protected readonly currentProject:CurrentProjectService,
              protected readonly cdr:ChangeDetectorRef) {
    super(i18n, injector);
  }

  ngOnInit() {
    this.setFields();
  }

  public get customFields() {
    return Object.values(this.customFieldsMap);
  }

  private setFields() {
    this
      .loadCurrentProject()
      .then(project => {
        Object.entries(project.$links).forEach(([key, link]) => {
          if (key.match(/customField\d+/)) {
            this.customFieldsMap[key] = {title: key, value: (link as HalLink).title};
          }
        });
        this.cdr.detectChanges();
      });
  }

  // TODO: use or introduce project cache and reuse on project-description
  private loadCurrentProject() {
    return this.projectDm.load(this.currentProject.id as string);
  }
}
